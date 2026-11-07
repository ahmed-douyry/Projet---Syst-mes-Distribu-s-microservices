import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  it('shouldToggleMobileNavigationAndDarkMode', async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const menu = element.querySelector<HTMLButtonElement>('.mobile-menu-button')!;
    menu.click();
    fixture.detectChanges();
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    fixture.componentInstance.closeMenu();
    fixture.detectChanges();
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    const initial = fixture.componentInstance.theme.dark();
    element.querySelector<HTMLButtonElement>('.theme-button')!.click();
    fixture.detectChanges();
    expect(document.documentElement.classList.contains('dark')).toBe(!initial);
    fixture.componentInstance.theme.dark.set(initial);
    fixture.detectChanges();
  });
});
