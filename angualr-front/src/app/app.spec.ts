import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  it('shouldRenderTheAccessibleApplicationShell', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(element.querySelector('main')?.id).toBe('main-content');
    expect(element.textContent).toContain('eBank');
  });
});
