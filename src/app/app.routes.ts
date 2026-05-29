import { Routes } from '@angular/router';
import { Receitas } from './pages/receitas/receitas';
import { Home } from './pages/home/home';

export const routes: Routes = [

{
  path: '',
  component: Home,
},
{
  path: 'receita/:id',
  component: Receitas,
},

];
