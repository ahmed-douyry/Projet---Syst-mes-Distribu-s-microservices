import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts', loadComponent: () => import('./accounts/accounts').then((m) => m.Accounts) },
  { path: 'bot', loadComponent: () => import('./bootui/bootui').then((m) => m.Bootui) },
];
