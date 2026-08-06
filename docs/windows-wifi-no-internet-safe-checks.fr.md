# Wi-Fi connecté mais pas d’Internet : vérifications sûres avant de contacter le support

**Statut éditorial :** brouillon soumis aux revues des preuves, UX, accessibilité, bilingue et technique. Pas encore publié.

**Adresse prévue :** `/fr/windows-wifi-no-internet-safe-checks.html`

**Public :** toute personne sans accès administrateur qui utilise Windows 10 ou Windows 11 et voit une connexion Wi-Fi ou l’état « Pas d’Internet » pendant l’échec d’une tâche qui nécessite Internet.

## Partir de la tâche en échec, pas d’un diagnostic réseau

Un appareil Windows peut être connecté à un réseau Wi-Fi local alors que l’accès Internet reste indisponible. Une icône Wi-Fi connectée ne prouve pas non plus que chaque site web, application, compte, VPN ou service professionnel est accessible.

Ce guide sert à noter l’état Windows visible, distinguer un problème limité à un service approuvé d’une perte de connectivité plus large, effectuer uniquement des vérifications réversibles et autorisées, puis préparer une demande de support utile. Il ne détermine pas si la cause vient de l’appareil, du signal sans fil, du routeur, du fournisseur Internet, du compte, de l’application, du VPN, du pare-feu, du DNS ou d’un autre composant réseau.

Si l’appareil ou le réseau appartient à un employeur, un établissement, un fournisseur de service ou une autre organisation, ses règles d’utilisation, de sécurité, de connectivité et de support restent prioritaires.

## S’arrêter lorsque le réseau, le message ou l’autorisation reste incertain

Ne continuez pas lorsque :

- le nom du réseau Wi-Fi attendu est incertain ou un réseau inconnu apparaît ;
- une page de connexion, un avertissement de certificat, une alerte de sécurité, une exigence VPN, un message de support inattendu, une demande de paiement ou d’accès à distance apparaît ;
- l’appareil ou le réseau est géré et vous n’êtes pas autorisé à modifier sa connexion ;
- plusieurs utilisateurs, un site entier, un service critique ou un travail lié à la sécurité sont affectés ;
- la carte Wi-Fi disparaît, l’appareil se déconnecte plusieurs fois ou un avertissement matériel apparaît ;
- l’action suivante demande des identifiants administrateur, l’accès au routeur, un mot de passe que vous ne possédez pas déjà, une modification de pilote ou de service, une commande, une réinitialisation réseau ou un changement des contrôles de sécurité ;
- le redémarrage d’un équipement réseau partagé risque d’interrompre une autre personne ou un service.

Utilisez un canal de support ou de sécurité approuvé. N’appelez pas un numéro et n’ouvrez pas un lien affiché dans un message de connectivité alarmant.

## Ce que « Connecté » et « Pas d’Internet » établissent

Windows utilise plusieurs indicateurs réseau. Une connexion Wi-Fi signifie que l’appareil a rejoint un réseau sans fil. L’état « Pas d’Internet » signifie que Windows ne détecte pas actuellement d’accès Internet par cette connexion. Aucun de ces états n’identifie la cause profonde.

Si l’icône Wi-Fi semble connectée mais qu’une tâche échoue, le problème peut être limité à une application, un site, un compte, un VPN ou un autre service. Notez la comparaison au lieu de considérer une seule destination réussie ou en échec comme une preuve de l’état complet du réseau.

## 1. Noter la tâche concernée et le message visible

Avant de modifier la connexion, notez :

- la tâche tentée ;
- l’application, le site ou le service concerné ;
- le message exact après retrait des informations privées ;
- la date et l’heure ;
- le fonctionnement récent éventuel de la tâche ;
- le caractère permanent ou intermittent du problème ;
- tout changement récent d’appareil, de lieu, de mise à jour, de réseau, de compte ou de VPN.

Exemple :

> Windows affiche le réseau Wi-Fi attendu comme connecté, mais la messagerie approuvée et le site de l’organisation ne se chargeaient pas à 9 h 40. La connexion fonctionnait hier. Je n’ai modifié ni le routeur, ni le VPN, ni le DNS, ni les paramètres de la carte réseau.

Cette description présente le symptôme sans affirmer que le Wi-Fi ou le fournisseur Internet est responsable.

## 2. Enregistrer le travail et déterminer le périmètre visible

Enregistrez les documents qui répondent avant de fermer les applications ou de redémarrer. Notez si la tâche en échec nécessite un accès Internet ordinaire, un service professionnel précis, un VPN ou une connexion à un compte.

Posez uniquement les questions de périmètre auxquelles vous pouvez répondre sans risque :

- Une seule application ou un seul site approuvé échoue-t-il, ou plusieurs destinations approuvées échouent-elles ?
- Windows affiche-t-il le nom du réseau attendu ?
- L’échec est-il permanent ou apparaît-il seulement à certains moments ?
- D’autres utilisateurs ou appareils autorisés signalent-ils le même problème ?

Ne recueillez pas l’historique de navigation, les identifiants, les références d’appareil ou les informations réseau confidentielles d’une autre personne.

## 3. Vérifier l’état Wi-Fi dans Windows

Sélectionnez la zone **Réseau, Son ou Batterie** dans la barre des tâches de Windows et examinez l’état visible de la connexion.

Notez :

- si le Wi-Fi est activé ;
- si le mode Avion est désactivé ;
- le nom du réseau connecté ;
- si Windows affiche **Connecté**, **Pas d’Internet** ou un autre état ;
- le niveau de signal visible ;
- si l’état change plusieurs fois.

Ne vous connectez pas à un réseau inconnu. Ne révélez pas et ne demandez pas de mot de passe Wi-Fi par un canal non approuvé. Si le réseau attendu est absent, si la carte réseau disparaît ou si Windows affiche un avertissement de sécurité, arrêtez-vous et signalez cet état.

## 4. Confirmer le réseau autorisé attendu

Comparez le nom visible avec celui que vous connaissez déjà ou qui est fourni par la procédure de support approuvée. Des noms similaires ne prouvent pas qu’un réseau est fiable.

Si l’appareil est déjà connecté au réseau attendu, laissez inchangés le profil réseau, la connexion automatique, le proxy, l’adresse IP, le DNS, les certificats et les paramètres de sécurité. Ne sélectionnez pas **Oublier**, ne vous reconnectez pas avec les identifiants d’une autre personne et ne passez pas par un partage de connexion personnel sur un appareil professionnel, sauf autorisation explicite.

Si un réseau public ou invité exige une page de connexion ou d’acceptation, suivez uniquement la procédure vérifiée du lieu ou de l’organisation. Arrêtez-vous en cas d’avertissement de certificat, de téléchargement inattendu, de demande de paiement ou de coordonnées de support.

## 5. Comparer des services approuvés sans exposer de données privées

Lorsque les règles l’autorisent, comparez la tâche en échec avec une autre destination Internet ou application familière et approuvée. Utilisez des destinations déjà fiables ; ne cherchez pas de sites de « test » aléatoires proposés par un message d’erreur.

Notez l’un des résultats suivants :

- un site ou une application approuvée échoue tandis qu’une autre fonctionne ;
- plusieurs services Internet approuvés échouent ;
- l’accès Internet ordinaire fonctionne, mais pas le VPN ou le service professionnel ;
- le résultat change entre les essais.

La comparaison précise le périmètre visible. Elle ne prouve pas si la cause vient de l’application, du compte, du navigateur, du réseau, du DNS, du pare-feu, du VPN, du fournisseur ou du service distant.

## 6. Comparer un autre appareil autorisé lorsqu’il est disponible

Si un autre appareil autorisé est déjà connecté au même réseau attendu, vérifiez si une destination familière et approuvée y fonctionne. N’ajoutez pas un nouvel appareil à un réseau géré uniquement pour ce test.

Notez si :

- seul l’appareil Windows concerné rencontre le problème ;
- plusieurs appareils autorisés ont le même problème ;
- l’appareil de comparaison utilise un autre réseau et ne permet donc pas une comparaison valable ;
- aucun appareil de comparaison sûr n’est disponible.

N’examinez pas l’activité privée d’une autre personne et ne supposez pas qu’une connexion réussie sur un téléphone prouve que tous les services sont accessibles à l’appareil Windows.

## 7. Redémarrer uniquement ce qui est sûr et autorisé

Après avoir enregistré le travail, un redémarrage normal de l’appareil Windows concerné constitue une première vérification réversible lorsque les règles locales le permettent. Après le redémarrage, notez l’état réseau de Windows et répétez une seule fois la tâche approuvée d’origine.

Redémarrez l’équipement réseau uniquement lorsque toutes les conditions suivantes sont remplies :

- vous possédez le modem ou le routeur, ou vous disposez d’une autorisation explicite ;
- vous identifiez le bon équipement et sa procédure normale d’alimentation ;
- la déconnexion temporaire de tous les utilisateurs n’entraîne pas d’impact inacceptable ;
- aucun avertissement, batterie, lien de secours, contrôleur géré ou autre élément ne rend l’action incertaine.

Sinon, arrêtez-vous et notez les voyants visibles sans appuyer sur un bouton de réinitialisation, retirer des câbles ou ouvrir une page d’administration. Ne réinitialisez jamais un équipement réseau aux paramètres d’usine comme première vérification.

## 8. Préparer la demande de support

Utilisez la structure suivante :

### Tâche et impact

Quelle tâche ne peut pas être terminée et quel travail ou quels utilisateurs sont affectés ?

### État réseau de Windows

Quel nom de réseau et quel état étaient visibles ? Le Wi-Fi était-il activé, le mode Avion désactivé et un signal présent ?

### Comparaison des services

Une destination approuvée a-t-elle échoué, plusieurs ont-elles échoué, ou seul un VPN ou service professionnel est-il concerné ?

### Comparaison des appareils

Un autre appareil autorisé sur le même réseau attendu a-t-il présenté le même résultat ?

### Moment et changement récent

Quand le problème a-t-il commencé ? A-t-il suivi un déplacement, un redémarrage, une mise à jour, une panne, un changement de compte, une modification du VPN ou aucun changement connu ?

### Vérifications et état actuel

Quelles vérifications sûres ont été effectuées et quel état apparaît maintenant ? N’incluez pas de mots de passe, d’adresses IP complètes, de données de compte privées ou d’informations réseau confidentielles, sauf demande précise de la procédure approuvée.

## Guide d’observation

| Observation | Élément sûr à noter | Quand arrêter |
| --- | --- | --- |
| État réseau de Windows | Nom attendu, Connecté ou Pas d’Internet, signal, date et heure | Réseau inconnu, disparition de la carte ou avertissement de sécurité |
| Tâche en échec | Application ou site approuvé et message exact anonymisé | Demande d’identifiants, de paiement, de téléchargement, d’accès à distance ou de contact non vérifié |
| Comparaison des services | Une destination approuvée par rapport à une autre | Le test exposerait des données privées ou contournerait une règle |
| Comparaison des appareils | Même réseau attendu et résultat général uniquement | L’appareil ou l’activité d’une autre personne n’est pas autorisé pour la comparaison |
| Résultat du redémarrage | Appareil concerné redémarré et tâche d’origine répétée une fois | Équipement réseau partagé géré, incertain ou perturbateur |
| Perte répétée | Fréquence, lieu, déplacement et changements d’état visibles | Plusieurs utilisateurs, travail critique, signes matériels ou réparation administrative concernés |

## Étape suivante

Un technicien autorisé peut utiliser ces informations pour déterminer si l’étape suivante concerne l’appareil, la carte sans fil, le réseau local, le routeur, le service Internet, la résolution de noms, le proxy, le VPN, le compte, l’application ou le service distant. Il peut utiliser des outils administratifs et des informations réseau volontairement exclus de ce guide.

Poursuivez avec l’une de ces ressources :

- Utilisez la **liste de diagnostic réseau et imprimante** pour organiser les observations autorisées.
- Consultez l’**étude de cas sur le dépannage de la connectivité réseau et d’une imprimante partagée** pour comprendre la méthode de diagnostic plus large du technicien.
- Lisez **Que faire face à une fenêtre de faux support technique** si un message de connectivité demande un appel, un téléchargement, un paiement, des identifiants, un code de sécurité ou un accès à distance.

## Note de portée

Ce guide fournit des conseils généraux d’observation, des vérifications réversibles sur l’appareil et la préparation d’une demande de support. Il ne garantit pas l’accès Internet, n’identifie pas la cause profonde, ne remplace pas les règles d’une organisation, n’administre pas un routeur, ne modifie pas les paramètres réseau, ne récupère pas les comptes, ne contourne pas une page de connexion et ne fournit aucune instruction sur les commandes, pilotes, services, VPN, pare-feu, DNS, IP, proxy, certificats, microprogramme ou réinitialisation réseau.

## Sources éditoriales

- [Résoudre les problèmes de connexion Wi-Fi dans Windows — Support Microsoft](https://support.microsoft.com/fr-FR/Windows/Experience/Connectivity-Networking/fix-wi-fi-connection-issues-in-windows)
- [Se connecter à un réseau Wi-Fi dans Windows — Support Microsoft](https://support.microsoft.com/fr-FR/Windows/Experience/Connectivity-Networking/connect-to-a-wi-fi-network-in-windows)
- [Paramètres et tâches réseau essentiels dans Windows — Support Microsoft](https://support.microsoft.com/fr-FR/Windows/Experience/Connectivity-Networking/essential-network-settings-and-tasks-in-windows)
- [Réseau Wi-Fi non sécurisé dans Windows — Support Microsoft](https://support.microsoft.com/fr-fr/windows/experience/connectivity-networking/wi-fi-network-not-secure-in-windows)
