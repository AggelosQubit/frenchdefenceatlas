import { Routes } from '@angular/router';
import { Histoire } from './histoire/histoire';
import { Home } from './home/home';
import { Retex } from './retex/retex';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'histoire',
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
