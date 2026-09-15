# 🇫🇷 French Defence Atlas

> **Comprendre ses forces · Son histoire militaire · Explorer son organisation · Répertorier ses moyens**

French Defence Atlas est un atlas numérique personnel consacré à la compréhension de la
Défense française. Il relie les institutions, les forces, les capacités, l’histoire militaire
et les enseignements de terrain dans une expérience documentaire immersive.

> [!IMPORTANT]
> Ce projet n’est ni un site institutionnel ni une source officielle. Les informations
> présentées devront être accompagnées de références et vérifiées.

## 🧭 Les cinq piliers

| | Domaine | Espace de connaissance | Question directrice | Future URL |
|---|---|---|---|---|
| 🛡️ | **Organisation** | La Défense française | Qui commande ? Qui agit ? Comment tout s’articule ? | `/organisation` |
| 📖 | **Histoire** | Histoire militaire | Quels choix, doctrines, opérations et héritages ? | `/histoire` |
| 🌍 | **Géopolitique** | La France dans le monde | Où se situent ses intérêts, alliances et rivalités ? | `/geopolitique` |
| 🎯 | **Moyens & Forces** | Les capacités militaires | Avec quelles forces, unités et technologies agir ? | `/capacites` |
| 📝 | **RETEx & Analyses** | Carnet de terrain | Qu’ai-je entendu, compris et que reste-t-il à vérifier ? | `/retex` |

## 🎬 Expérience actuelle

La première version se concentre uniquement sur la page d’accueil :

- 🎥 hero cinématique utilisant une vidéo MP4 locale ;
- 🔊 activation et désactivation du son ;
- 🧭 navigation interne vers les cinq piliers ;
- 🗺️ sections immersives avec profondeur et parallax ;
- ↗️ boutons préparant les futures pages, sans créer leurs routes ;
- 📱 interface responsive ;
- ♿ respect de la préférence de réduction des animations.

## 🎨 Direction artistique

L’identité visuelle associe un atlas stratégique contemporain à l’héritage militaire français.

| Élément | Référence | Usage |
|---|---|---|
| 🔤 Typographie | **Orbitron** | Titres, navigation, textes et interface |
| 🌌 Bleu nuit | `#101820` | Structure, profondeur et sérieux |
| 🏜️ Sable | `#D8C7A1` | Repères, détails et héritage |
| 📄 Blanc cassé | `#F3F1EB` | Texte principal et lisibilité |
| 🌲 Vert opérationnel | `#34483C` | Terrain, défense et accents visuels |
| ✝️ Croix de Lorraine | `favicon.svg` | Symbole et favicon du projet |

Le parallax accompagne la progression documentaire sans transformer l’interface en faux
tableau de commandement ou en esthétique militaire surchargée.

## 🧰 Technologies

| Technologie | Rôle |
|---|---|
| **Angular 21** | Framework de l’application |
| **Standalone Components** | Architecture Angular légère |
| **TypeScript** | Logique et typage |
| **SCSS** | Direction artistique et responsive |

## 🚀 Installation

```bash
npm install
npm start
```

L’application est ensuite disponible sur
[http://localhost:4200](http://localhost:4200).

## 📦 Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans `dist/french-defence-atlas/`.

## 🗂️ Structure actuelle

```text
src/
├── app/
│   ├── home/
│   │   ├── home.html
│   │   ├── home.scss
│   │   └── home.ts
│   ├── app.config.ts
│   ├── app.html
│   ├── app.routes.ts
│   └── app.ts
├── index.html
├── main.ts
└── styles.scss

public/
├── videos/
│   └── mtplf.mp4
└── favicon.svg
```

## 🛣️ Feuille de route

- [x] 🏠 Construire l’expérience de la page d’accueil
- [x] 🎬 Intégrer la vidéo d’ouverture locale
- [x] 🧭 Présenter les cinq piliers de l’atlas
- [x] ✝️ Créer la favicon à la croix de Lorraine
- [ ] 🧱 Créer progressivement les cinq pages principales
- [ ] 🧬 Définir les modèles de données et les sources
- [ ] 🗃️ Construire les fiches des organisations, unités et matériels
- [ ] 🔗 Relier les contenus entre eux
- [ ] 📚 Intégrer les références historiques et documentaires
- [ ] 📝 Développer le carnet RETEx

---

<p align="center">
  🇫🇷 <strong>French Defence Atlas</strong><br>
  Comprendre · Explorer · Répertorier
</p>
