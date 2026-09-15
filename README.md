# French Defence Atlas

French Defence Atlas est un atlas numérique personnel consacré à la compréhension de la
Défense française. Son objectif est de relier les institutions, les forces, les moyens,
l’histoire militaire et les enseignements de terrain dans une interface documentaire
cohérente.

Le projet n’est ni un site institutionnel ni une source officielle. Il constitue un outil
d’apprentissage dont les informations devront être accompagnées de références et vérifiées.

## Les cinq piliers

L’atlas est structuré autour de cinq domaines :

1. **Organisation — La Défense française**  
   Institutions, chaînes de commandement, directions, services et articulation générale.
2. **Histoire — Histoire militaire**  
   Choix stratégiques, doctrines, grandes opérations, traditions et héritages.
3. **Géopolitique — La France dans le monde**  
   Alliances, rivalités, territoires, intérêts et stratégie internationale.
4. **Moyens & Forces — Les capacités militaires**  
   Armées, unités, équipements, bases, systèmes, métiers et savoir-faire.
5. **RETEx & Analyses — Carnet de terrain**  
   Événements, observations personnelles, lectures, réflexions et éléments à vérifier.

## Expérience actuelle

La première version se concentre uniquement sur la page d’accueil :

- hero cinématique avec une vidéo MP4 locale ;
- activation et désactivation du son ;
- navigation interne vers les cinq piliers ;
- sections immersives avec effets de profondeur et de parallax ;
- boutons préparant les futures pages, sans que celles-ci soient encore créées ;
- interface responsive et respect de la préférence de réduction des animations.

## Direction artistique

L’identité visuelle associe un atlas stratégique contemporain à l’héritage militaire
français :

- typographie **Orbitron** ;
- bleu nuit `#101820` ;
- sable `#D8C7A1` ;
- blanc cassé `#F3F1EB` ;
- vert opérationnel `#34483C` ;
- croix de Lorraine comme favicon.

Le parallax doit soutenir la lecture et la progression documentaire, sans reproduire une
interface militaire fictive ou surchargée.

## Technologies

- Angular 21 ;
- composants standalone ;
- TypeScript ;
- SCSS.

## Installation

```bash
npm install
npm start
```

L’application est ensuite disponible sur `http://localhost:4200/`.

## Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans `dist/french-defence-atlas/`.


```

## Prochaines étapes

- créer progressivement les cinq pages principales ;
- définir les modèles de données et les sources ;
- construire les fiches des organisations, unités et matériels ;
- relier les contenus entre eux ;
- intégrer les références historiques et documentaires ;
- développer le carnet RETEx.
