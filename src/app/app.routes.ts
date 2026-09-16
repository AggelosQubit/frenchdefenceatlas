import { Routes } from '@angular/router';
import { Histoire } from './histoire/histoire';
import { Home } from './home/home';

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
    path: '**',
    redirectTo: '',
  },
];
