import { Documentary, DocumentaryCategory } from './histoire.model';

export const DOCUMENTARY_CATEGORIES: readonly DocumentaryCategory[] = [
  {
    id: 'de-gaulle',
    title: 'De Gaulle',
    summary: 'Biographie, mémoire, diplomatie et indépendance stratégique.',
  },
  {
    id: 've-republique',
    title: 'Ve République',
    summary: 'Institutions, crises et exercice du pouvoir depuis 1958.',
  },
  {
    id: 'europe-puissance',
    title: 'Europe / puissance',
    summary: 'La place de la France dans la construction européenne.',
  },
  {
    id: 'guerre-conflits',
    title: 'Guerre / conflits',
    summary: 'Conflits, opérations et ruptures militaires. Fonds à constituer.',
  },
];

export const DOCUMENTARIES: readonly Documentary[] = [
  {
    id: 'de-gaulle-geant',
    number: '01',
    year: 1940,
    title: 'De Gaulle : histoire d’un géant',
    channel: 'imineo Documentaires',
    description:
      'Biographie de De Gaulle, de sa carrière militaire à la France libre puis à son parcours politique et présidentiel.',
    url: 'https://www.youtube.com/watch?v=SFxtJNIm08g',
    category: 'de-gaulle',
  },
  {
    id: 'de-gaulle-onu',
    number: '02',
    year: 1945,
    title: 'De Gaulle et l’ONU : Comment la France a arraché son siège permanent',
    channel: 'SLICE Histoire',
    description:
      'Le rôle de De Gaulle et de la diplomatie française dans la position de la France au Conseil de sécurité de l’ONU et dans son statut de puissance diplomatique.',
    url: 'https://www.youtube.com/watch?v=IzmPON8lTJM',
    category: 'de-gaulle',
  },
  {
    id: 'republique-des-crises',
    number: '03',
    year: 1958,
    title: 'La République des crises : histoire du pouvoir en France depuis 1958',
    channel: 'Notre Histoire',
    description:
      'Évolution du pouvoir politique sous la Ve République depuis 1958, avec un focus sur les institutions, les crises et l’exercice du pouvoir.',
    url: 'https://www.youtube.com/watch?v=_lSA9NDbdNA',
    category: 've-republique',
  },
  {
    id: 'de-gaulle-politique-etrangere',
    number: '04',
    year: 1959,
    title: '1958–1969 : Comment De Gaulle a redéfini la politique étrangère française ?',
    channel: 'Notre Histoire',
    description:
      'La politique étrangère gaullienne : indépendance stratégique, relations avec les États-Unis et l’URSS, Europe et conception française de la puissance.',
    url: 'https://www.youtube.com/watch?v=3Iefd02jsOM',
    category: 'de-gaulle',
  },
  {
    id: 'de-gaulle-surveille',
    number: '05',
    year: 1962,
    title: 'De Gaulle surveillé : L’ingérence secrète des États-Unis en France',
    channel: 'SLICE Histoire',
    description:
      'Relations franco-américaines autour de De Gaulle, avec un focus sur les tensions, la surveillance et les documents américains déclassifiés évoqués dans le documentaire.',
    url: 'https://www.youtube.com/watch?v=OcHsiIvlsBk',
    category: 'de-gaulle',
  },
  {
    id: 'mythe-de-gaulle',
    number: '06',
    year: 1970,
    title: 'Le mythe De Gaulle',
    channel: 'Rivenzi',
    description:
      'Analyse de la construction de la figure de De Gaulle et de la distinction entre le personnage historique, son action et la mémoire construite autour de lui.',
    url: 'https://www.youtube.com/watch?v=1xOEAknPIds',
    category: 'de-gaulle',
  },
];
