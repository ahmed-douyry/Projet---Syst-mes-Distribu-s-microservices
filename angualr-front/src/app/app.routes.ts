import { Routes } from '@angular/router';
import {Accounts} from './accounts/accounts';
import {Bootui} from './bootui/bootui';

export const routes: Routes = [
  {path:"accounts" , component:Accounts},
  {path:"bot", component:Bootui}
];
