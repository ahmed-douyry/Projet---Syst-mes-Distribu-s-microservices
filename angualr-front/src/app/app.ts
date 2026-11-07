import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  readonly sectionTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) =>
        event.urlAfterRedirects.startsWith('/bot') ? 'Assistant bancaire' : 'Comptes',
      ),
    ),
    { initialValue: this.router.url.startsWith('/bot') ? 'Assistant bancaire' : 'Comptes' },
  );
}
