import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly dark = signal(this.initialTheme());

  constructor() {
    effect(() => {
      const dark = this.dark();
      this.document.documentElement.classList.toggle('dark', dark);
      this.document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      if (this.browser) {
        try {
          localStorage.setItem('ebank-theme', dark ? 'dark' : 'light');
        } catch {
          /* Storage may be unavailable. */
        }
      }
    });
  }

  toggle(): void {
    this.dark.update((value) => !value);
  }

  private initialTheme(): boolean {
    if (!this.browser) return false;
    try {
      const saved = localStorage.getItem('ebank-theme');
      if (saved === 'dark' || saved === 'light') return saved === 'dark';
    } catch {
      /* Fall back to the system preference. */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
