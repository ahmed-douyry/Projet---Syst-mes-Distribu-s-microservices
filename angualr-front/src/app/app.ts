import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , Navbar],
    template:
      `<app-navbar></app-navbar>

      <main>
      <router-outlet></router-outlet>
      </main>`
})
export class App {
  protected readonly title = signal('angualr-front');
}
