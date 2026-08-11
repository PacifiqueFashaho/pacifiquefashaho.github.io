# Plateforme de portfolio bilingue — Brouillon français de l’étude de cas

Statut : brouillon éditorial contrôlé par les preuves ; publication interdite avant l’actualisation des faits de mise en production.

## Métadonnées

**URL proposée :** `/fr/project-portfolio-case-study.html`
**Titre :** Étude de cas de la plateforme de portfolio bilingue | Pacifique Fashaho
**Description :** Comment j’ai conçu, développé, validé et déployé un portfolio bilingue avec des pratiques front-end accessibles, des contrôles automatisés, un SEO technique et une mesure d’audience soumise au consentement.

## Héros

Sur-titre : Projet personnel implémenté · En production et maintenu

# Concevoir et mettre en production une plateforme de portfolio bilingue

J’ai conçu et développé ce portfolio comme un produit logiciel maintenu, et non comme une simple page de présentation. Il relie une introduction personnelle, des preuves professionnelles, des projets, des certifications, des guides pratiques et des parcours de contact en anglais et en français.

L’implémentation utilise HTML, CSS et JavaScript, avec une validation automatisée du dépôt et un processus de mise en production versionné sur GitHub Pages. Il s’agit d’un projet personnel, pas d’une commande client.

Action principale : Explorer l’implémentation
Action secondaire : Visiter la plateforme en production
Action complémentaire : Voir le dépôt

## Aperçu du produit

- Produit : portfolio statique, multipage et bilingue
- Rôle : architecture de l’information, UX/UI, développement front-end, localisation, accessibilité, SEO, assurance qualité et gestion des mises en production
- Langues : anglais et français
- Diffusion : GitHub Pages
- Qualité : contrôles automatisés sur les pull requests et les changements de production
- Note de référence : les nombres de fichiers et de pages doivent être insérés depuis la vérification de preuves au moment de la publication

## Le problème

Mon travail couvre le support informatique, le développement logiciel et l’analyse de données. Une page d’accueil construite comme un CV rendait cette diversité difficile à comprendre et encourageait les visiteurs à considérer tous les éléments comme le même type de preuve.

Le produit devait aider plusieurs visiteurs à répondre à des questions différentes :

- Qui suis-je au-delà d’un CV ?
- Quel travail technique puis-je réaliser ?
- Quels exemples relèvent de l’expérience professionnelle, d’un projet implémenté, d’un processus représentatif ou d’une étude d’apprentissage ?
- Comment un recruteur peut-il vérifier les certifications et accéder au bon parcours de contact ?
- Comment proposer une information équivalente en anglais et en français sans maintenir deux sites déconnectés ?

## Contraintes et règles de preuve

Le site est public, statique et maintenu de manière indépendante. Cela impose plusieurs contraintes :

- protéger les documents privés et ne pas exposer le contenu personnel des formulaires ;
- limiter chaque affirmation à ce que les preuves publiées démontrent ;
- maintenir des routes anglaises et françaises réciproques ;
- rester utilisable sur mobile et avec une connexion limitée ;
- conserver un contenu compréhensible lorsque JavaScript n’est pas disponible ;
- utiliser un processus de publication capable de détecter les liens cassés, les métadonnées manquantes et les écarts entre langues.

## Architecture de l’information

J’ai séparé le produit en parcours ciblés au lieu de tout concentrer sur une longue page d’accueil :

- À propos présente mon identité et mon parcours en évolution.
- Portfolio organise les compétences, l’expérience, les qualifications, la contribution et le contact.
- Projets fournit un catalogue de preuves par catégorie.
- Les études de cas expliquent les méthodes et les décisions en profondeur.
- Certifications sépare les qualifications principales des apprentissages complémentaires.
- Les guides proposent un contenu pratique de support informatique.
- Confidentialité explique clairement les choix de mesure d’audience.

La navigation, les contrôles de langue, les pieds de page, les modèles de métadonnées, les styles et les scripts partagés relient ces parcours.

## Architecture front-end

La plateforme utilise des routes HTML statiques avec des ressources CSS, JavaScript, images, données et documents partagées. JavaScript améliore progressivement la navigation, les thèmes, le filtrage des projets, l’assistance de contact, les interactions de la page À propos et la mesure respectueuse de la confidentialité.

L’expérience publiée ne dépend pas d’un framework. Le déploiement reste ainsi simple et le contenu principal demeure lisible avant l’exécution des scripts d’amélioration.

Note visuelle : montrer `Pages bilingues → ressources et données partagées → validateur local → GitHub Actions → GitHub Pages`.

## Décisions de conception sélectionnées

### Une entrée personnelle et plusieurs parcours professionnels

La page À propos est devenue l’accueil, tandis que les preuves destinées aux recruteurs restent dans le portfolio et les projets. Cette séparation réduit le conflit entre une présentation personnelle et un profil professionnel dense.

### Des types de preuves visibles

Les compétences et projets distinguent les projets implémentés, les processus représentatifs, les études d’apprentissage et les certifications vérifiées. Le vocabulaire évite de présenter un exercice d’apprentissage comme une mission client.

### Une composition réellement adaptative

Les grilles passent intentionnellement de trois colonnes à deux, puis à une. Les composants peuvent se réduire, revenir à la ligne ou occuper une rangée complète au lieu d’imposer une mise en page de bureau sur un petit écran.

### Des modèles partagés pour maintenir la parité bilingue

Le registre de paires de pages, les liens de langue réciproques, les ressources partagées et les contrôles automatisés réduisent les écarts tout en permettant une rédaction française naturelle.

## Ingénierie de l’accessibilité

Les protections implémentées comprennent des repères sémantiques, une hiérarchie de titres, des liens d’évitement, des contrôles utilisables au clavier, un focus visible, des libellés et descriptions de formulaire, des zones de statut, la réduction des animations et un contenu de base indépendant de JavaScript.

Ces éléments constituent des protections d’implémentation, pas une certification formelle. Chaque publication exige encore des contrôles visuels, clavier, adaptatifs et bilingues.

## Mesure d’audience respectueuse de la confidentialité

La mesure est facultative. La balise Google ne se charge pas avant une autorisation explicite. Global Privacy Control et Do Not Track imposent le refus. Le stockage publicitaire et la personnalisation restent désactivés.

Les événements personnalisés autorisés utilisent des noms fixes et des cibles non personnelles. Les noms, adresses e-mail, messages, valeurs de formulaire, paramètres de requête et identifiants utilisateur personnalisés sont exclus des paramètres envoyés par le portfolio.

Les visiteurs peuvent consulter ou modifier leur choix depuis les pages bilingues de confidentialité.

## Assurance qualité

Le dépôt contient un validateur Python qui contrôle les pages enregistrées, les ressources internes, les relations bilingues, les métadonnées, les données structurées, le sitemap, les fichiers protégés, l’architecture JavaScript, les marqueurs d’accessibilité, les budgets de performance et les routes HTTP locales.

GitHub Actions exécute des contrôles de syntaxe JavaScript, des tests de l’assistant et la validation statique pour les pull requests et la branche de production. La publication suit la séquence branche, revue, CI, fusion, déploiement et vérification de production.

## SEO technique et visibilité

La plateforme implémente des URL canoniques, des liens hreflang réciproques, des titres et descriptions adaptés à la langue, des aperçus sociaux, des données structurées, des instructions robots et un sitemap XML.

Ces contrôles améliorent la clarté technique pour les moteurs. Ils ne garantissent ni indexation, ni position, ni impressions, ni clics ; les résultats de recherche restent séparés des affirmations d’implémentation.

## Résultat

Le résultat est un produit bilingue en production qui présente mon profil technologique à travers des parcours de preuves reliés mais distincts. Le principal résultat démontrable est le système lui-même : une implémentation publique avec des ressources maintenables, des protections automatisées, des publications traçables et des limites documentées.

Panneau factuel à actualiser avant publication :

- pages du portfolio validées ;
- portée actuelle du dépôt ;
- commit de production ;
- derniers contrôles de qualité et de déploiement réussis.

## Ce que j’ai appris

- L’architecture de l’information fait partie de la qualité logicielle.
- La parité bilingue nécessite des contrôles automatisés en plus de la révision linguistique.
- Les régressions d’accessibilité apparaissent souvent aux limites des composants et des points de rupture.
- Des libellés de preuve précis renforcent davantage la crédibilité que des affirmations générales.
- Une construction locale réussie ne prouve pas que l’artefact de production est à jour.
- Les choix de confidentialité doivent guider l’instrumentation avant la collecte des données.

## Limites et prochaines itérations

Il s’agit d’un produit statique et personnel. Il ne démontre actuellement ni authentification, ni service avec base de données, ni développement en équipe, ni exigences client. La réception des données analytiques et les conversions doivent rester classées comme indisponibles tant qu’elles ne sont pas vérifiées chez le fournisseur.

Les prochaines améliorations doivent rester fondées sur les preuves : développer les études de cas logicielles, renforcer les tests lorsque les comportements deviennent plus complexes et optimiser les parcours recruteur uniquement lorsque des données alignées sont disponibles.

## Action finale

Titre : Besoin d’une personne capable de relier UX, développement front-end et livraison rigoureuse ?

Texte : Je suis disponible pour des postes, stages et projets où je peux contribuer à des interfaces accessibles, un front-end maintenable, l’automatisation ou une livraison technologique multidisciplinaire.

Action principale : Discuter d’une opportunité logicielle
Action secondaire : Comparer tous les projets
Liens complémentaires : Plateforme en production · Dépôt · Confidentialité et mesure
