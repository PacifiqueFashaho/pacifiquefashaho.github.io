param(
    [string]$OutputDirectory = (Join-Path $env:TEMP 'portfolio-homepage-qa'),
    [ValidateSet('home', 'portfolio')]
    [string]$PageSet = 'home'
)

$ErrorActionPreference = 'Stop'
$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$debugPort = 9333
$profilePath = Join-Path $OutputDirectory 'chrome-profile'

if (-not (Test-Path -LiteralPath $chromePath)) {
    throw "Chrome was not found at $chromePath"
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $profilePath | Out-Null

$chromeArguments = @(
    '--headless=new'
    '--disable-gpu'
    '--hide-scrollbars'
    '--remote-allow-origins=*'
    '--remote-debugging-address=127.0.0.1'
    '--no-first-run'
    '--disable-extensions'
    "--remote-debugging-port=$debugPort"
    "--user-data-dir=$profilePath"
    'about:blank'
)

$chromeProcess = Start-Process -FilePath $chromePath -ArgumentList ($chromeArguments -join ' ') -WindowStyle Hidden -PassThru

function Send-CdpCommand {
    param(
        [System.Net.WebSockets.ClientWebSocket]$Socket,
        [int]$Id,
        [string]$Method,
        [hashtable]$Parameters = @{}
    )

    $payload = @{ id = $Id; method = $Method; params = $Parameters } | ConvertTo-Json -Compress -Depth 12
    $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
    $sendSegment = [ArraySegment[byte]]::new($bytes)
    $null = $Socket.SendAsync($sendSegment, [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

    while ($true) {
        $stream = [IO.MemoryStream]::new()
        do {
            $buffer = New-Object byte[] 65536
            $receiveSegment = [ArraySegment[byte]]::new($buffer)
            $result = $Socket.ReceiveAsync($receiveSegment, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
            $stream.Write($buffer, 0, $result.Count)
        } while (-not $result.EndOfMessage)
        $message = [Text.Encoding]::UTF8.GetString($stream.ToArray()) | ConvertFrom-Json
        $stream.Dispose()
        if ($message.id -eq $Id) {
            if ($message.error) {
                throw "$Method failed: $($message.error.message)"
            }
            return $message.result
        }
    }
}

function Save-CdpScreenshot {
    param(
        [System.Net.WebSockets.ClientWebSocket]$Socket,
        [int]$Id,
        [string]$Path
    )
    $result = Send-CdpCommand -Socket $Socket -Id $Id -Method 'Page.captureScreenshot' -Parameters @{ format = 'png'; fromSurface = $true; captureBeyondViewport = $false }
    [IO.File]::WriteAllBytes($Path, [Convert]::FromBase64String($result.data))
}

try {
    $endpoint = $null
    for ($attempt = 0; $attempt -lt 120; $attempt++) {
        try {
            $endpoint = Invoke-RestMethod -Uri "http://127.0.0.1:$debugPort/json/list"
            if ($endpoint) { break }
        } catch {
            Start-Sleep -Milliseconds 100
        }
    }
    if (-not $endpoint) { throw 'Chrome debugging endpoint did not become available.' }
    $pageTarget = $endpoint | Where-Object type -eq 'page' | Select-Object -First 1
    if (-not $pageTarget) { throw 'Chrome did not expose a page target.' }

    $socket = [Net.WebSockets.ClientWebSocket]::new()
    $null = $socket.ConnectAsync([Uri]$pageTarget.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    $commandId = 0
    $records = [Collections.Generic.List[object]]::new()
    $pages = if ($PageSet -eq 'portfolio') {
        @(
            @{ Language = 'en'; Path = 'portfolio.html' }
            @{ Language = 'fr'; Path = 'fr/portfolio.html' }
        )
    } else {
        @(
            @{ Language = 'en'; Path = 'index.html' }
            @{ Language = 'fr'; Path = 'fr/index.html' }
        )
    }
    $viewports = @(
        @{ Name = 'desktop'; Width = 1280; Height = 900; Mobile = $false }
        @{ Name = 'phone-320'; Width = 320; Height = 700; Mobile = $true }
        @{ Name = 'phone-375'; Width = 375; Height = 812; Mobile = $true }
        @{ Name = 'phone-390'; Width = 390; Height = 844; Mobile = $true }
    )

    foreach ($page in $pages) {
        foreach ($viewport in $viewports) {
            $commandId++
            Send-CdpCommand -Socket $socket -Id $commandId -Method 'Emulation.setDeviceMetricsOverride' -Parameters @{
                width = $viewport.Width
                height = $viewport.Height
                deviceScaleFactor = 1
                mobile = $viewport.Mobile
                screenWidth = $viewport.Width
                screenHeight = $viewport.Height
            } | Out-Null
            $commandId++
            Send-CdpCommand -Socket $socket -Id $commandId -Method 'Page.navigate' -Parameters @{ url = "http://127.0.0.1:8000/$($page.Path)" } | Out-Null
            $expectedPath = "/$($page.Path)"
            for ($readyAttempt = 0; $readyAttempt -lt 30; $readyAttempt++) {
                Start-Sleep -Milliseconds 100
                $commandId++
                $readyResult = Send-CdpCommand -Socket $socket -Id $commandId -Method 'Runtime.evaluate' -Parameters @{
                    returnByValue = $true
                    expression = "location.pathname === '$expectedPath' && document.readyState === 'complete' && Boolean(document.querySelector('.about-hero, .hero'))"
                }
                if ($readyResult.result.value) { break }
            }
            if (-not $readyResult.result.value) {
                throw "Homepage did not become ready: $($page.Path)"
            }
            Start-Sleep -Milliseconds 250

            $commandId++
            $metricsResult = Send-CdpCommand -Socket $socket -Id $commandId -Method 'Runtime.evaluate' -Parameters @{
                returnByValue = $true
                expression = @'
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.about-hero, .hero');
  const evidence = document.querySelector('.about-evidence, #selected-work');
  const education = document.querySelector('.about-education, #education');
  const foundation = document.querySelector('#foundation-title')?.closest('section');
  const skills = document.querySelector('#skills');
  const experience = document.querySelector('#experience');
  const projectDetails = document.querySelector('#project-details');
  const services = document.querySelector('#services');
  const actions = [...hero.querySelectorAll('.about-actions a, .hero-v2__actions a')];
  const proofCards = [...document.querySelectorAll('.about-proof, #selected-work .portfolio-evidence-card')];
  const visiblePortrait = (() => { const node = document.querySelector('.about-portrait, .hero .avatar'); return node && getComputedStyle(node).display !== 'none'; })();
  const compactMenu = document.querySelector('.nav-toggle');
  return {
    url: location.href,
    language: document.documentElement.lang,
    viewportWidth: innerWidth,
    viewportHeight: innerHeight,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    scrollHeight: root.scrollHeight,
    horizontalOverflow: root.scrollWidth > root.clientWidth,
    heroBottom: Math.round(hero.getBoundingClientRect().bottom + scrollY),
    evidenceTop: Math.round(evidence.getBoundingClientRect().top + scrollY),
    firstProofLinkTop: Math.round(proofCards[0].querySelector('a').getBoundingClientRect().top + scrollY),
    skillsTop: skills ? Math.round(skills.getBoundingClientRect().top + scrollY) : null,
    experienceTop: experience ? Math.round(experience.getBoundingClientRect().top + scrollY) : null,
    projectDetailsTop: projectDetails ? Math.round(projectDetails.getBoundingClientRect().top + scrollY) : null,
    servicesTop: services ? Math.round(services.getBoundingClientRect().top + scrollY) : null,
    sectionsInOrder: skills && experience && projectDetails && services &&
      skills.compareDocumentPosition(experience) === Node.DOCUMENT_POSITION_FOLLOWING &&
      experience.compareDocumentPosition(projectDetails) === Node.DOCUMENT_POSITION_FOLLOWING &&
      projectDetails.compareDocumentPosition(services) === Node.DOCUMENT_POSITION_FOLLOWING,
    proofCount: proofCards.length,
    heroActionCount: actions.length,
    heroActionsMinHeight: Math.min(...actions.map(node => node.getBoundingClientRect().height)),
    evidenceBeforeEducation: evidence.compareDocumentPosition(education) === Node.DOCUMENT_POSITION_FOLLOWING,
    foundationBeforeEducation: foundation ? foundation.compareDocumentPosition(education) === Node.DOCUMENT_POSITION_FOLLOWING : null,
    portraitVisible: visiblePortrait,
    compactMenuVisible: compactMenu && getComputedStyle(compactMenu).display !== 'none',
    h1: document.querySelector('h1')?.innerText,
    evidenceHeading: evidence.querySelector('h2')?.innerText
  };
})()
'@
            }
            $metrics = $metricsResult.result.value
            $menuOpens = $null
            $menuCloses = $null
            $menuFitsViewport = $null
            if ($viewport.Mobile) {
                $commandId++
                $menuOpenResult = Send-CdpCommand -Socket $socket -Id $commandId -Method 'Runtime.evaluate' -Parameters @{
                    returnByValue = $true
                    expression = @'
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primaryNavigation');
  toggle.click();
  const rect = nav.getBoundingClientRect();
  return {
    opens: toggle.getAttribute('aria-expanded') === 'true' && nav.classList.contains('is-open'),
    fits: rect.left >= 0 && rect.right <= innerWidth
  };
})()
'@
                }
                $menuOpens = $menuOpenResult.result.value.opens
                $menuFitsViewport = $menuOpenResult.result.value.fits
                $commandId++
                $menuCloseResult = Send-CdpCommand -Socket $socket -Id $commandId -Method 'Runtime.evaluate' -Parameters @{
                    returnByValue = $true
                    expression = @'
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primaryNavigation');
  toggle.click();
  return toggle.getAttribute('aria-expanded') === 'false' && !nav.classList.contains('is-open');
})()
'@
                }
                $menuCloses = $menuCloseResult.result.value
            }
            $records.Add([pscustomobject]@{
                Language = $page.Language
                Viewport = $viewport.Name
                RequestedWidth = $viewport.Width
                RequestedHeight = $viewport.Height
                ActualWidth = $metrics.viewportWidth
                ActualHeight = $metrics.viewportHeight
                ClientWidth = $metrics.clientWidth
                ScrollWidth = $metrics.scrollWidth
                ScrollHeight = $metrics.scrollHeight
                HorizontalOverflow = $metrics.horizontalOverflow
                HeroBottom = $metrics.heroBottom
                EvidenceTop = $metrics.evidenceTop
                FirstProofLinkTop = $metrics.firstProofLinkTop
                SkillsTop = $metrics.skillsTop
                ExperienceTop = $metrics.experienceTop
                ProjectDetailsTop = $metrics.projectDetailsTop
                ServicesTop = $metrics.servicesTop
                SectionsInOrder = $metrics.sectionsInOrder
                ProofCount = $metrics.proofCount
                HeroActionCount = $metrics.heroActionCount
                HeroActionsMinHeight = $metrics.heroActionsMinHeight
                EvidenceBeforeEducation = $metrics.evidenceBeforeEducation
                FoundationBeforeEducation = $metrics.foundationBeforeEducation
                PortraitVisible = $metrics.portraitVisible
                CompactMenuVisible = $metrics.compactMenuVisible
                MenuOpens = $menuOpens
                MenuCloses = $menuCloses
                MenuFitsViewport = $menuFitsViewport
                Heading = $metrics.h1
                EvidenceHeading = $metrics.evidenceHeading
            })

            $topPath = Join-Path $OutputDirectory "$($page.Language)-$($viewport.Name)-top.png"
            $commandId++
            Save-CdpScreenshot -Socket $socket -Id $commandId -Path $topPath
            if ($viewport.Mobile -and $PageSet -eq 'home') {
                $commandId++
                Send-CdpCommand -Socket $socket -Id $commandId -Method 'Runtime.evaluate' -Parameters @{ expression = "window.scrollTo(0, $($viewport.Height)); true"; returnByValue = $true } | Out-Null
                Start-Sleep -Milliseconds 120
                $secondPath = Join-Path $OutputDirectory "$($page.Language)-$($viewport.Name)-second.png"
                $commandId++
                Save-CdpScreenshot -Socket $socket -Id $commandId -Path $secondPath
            } elseif ($PageSet -eq 'portfolio') {
                foreach ($capture in @(
                    @{ Name = 'evidence'; Top = $metrics.evidenceTop },
                    @{ Name = 'skills'; Top = $metrics.skillsTop }
                    @{ Name = 'experience'; Top = $metrics.experienceTop }
                    @{ Name = 'project-details'; Top = $metrics.projectDetailsTop }
                    @{ Name = 'services'; Top = $metrics.servicesTop }
                )) {
                    $commandId++
                    Send-CdpCommand -Socket $socket -Id $commandId -Method 'Runtime.evaluate' -Parameters @{ expression = "document.documentElement.style.scrollBehavior='auto'; window.scrollTo({top:Math.max(0,$($capture.Top)-76),behavior:'instant'}); true"; returnByValue = $true } | Out-Null
                    Start-Sleep -Milliseconds 500
                    $capturePath = Join-Path $OutputDirectory "$($page.Language)-$($viewport.Name)-$($capture.Name).png"
                    $commandId++
                    Save-CdpScreenshot -Socket $socket -Id $commandId -Path $capturePath
                }
            }
        }
    }
    $records | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'metrics.json') -Encoding utf8
    $records | Format-Table Language,Viewport,ActualWidth,ClientWidth,ScrollWidth,HorizontalOverflow,ProofCount,HeroActionCount,MenuOpens,MenuCloses,MenuFitsViewport -AutoSize
    $socket.Dispose()
} finally {
    if ($chromeProcess -and -not $chromeProcess.HasExited) {
        Stop-Process -Id $chromeProcess.Id -Force
    }
}
