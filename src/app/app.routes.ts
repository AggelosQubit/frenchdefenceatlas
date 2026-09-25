import { Routes } from '@angular/router';
import { Architecture } from './architecture/architecture';
import { Histoire } from './histoire/histoire';
import { Home } from './home/home';
import { Retex } from './retex/retex';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'architecture',
    component: Architecture,
  },
  {
    path: 'architecture/:id',
    component: Architecture,
  },
  {
    path: 'histoire',
    component: Histoire,
  },
  {
    path: 'histoire/documentaires',
    component: Histoire,
  },
  {
    path: 'histoire/documentaires/:docId',
    component: Histoire,
  },
  {
    path: 'histoire/:id',
    component: Histoire,
  },
  {
    path: 'retex',
    component: Retex,
  },
  {
    path: 'retex/:id',
    component: Retex,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
