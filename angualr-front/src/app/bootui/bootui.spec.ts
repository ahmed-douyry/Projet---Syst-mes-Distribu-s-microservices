import { provideHttpClient, HttpEventType } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMarkdown } from 'ngx-markdown';
import { Bootui } from './bootui';
const endpoint = 'http://localhost:9999/EBANK-BOOT/chatStream';
const markdown =
  'Voici la liste des clients :\n\n| ID | Nom | Email |\n| --- | --- | --- |\n| 1 | Ahmed | ahmed@example.test |\n| 2 | Yassine | yassine@example.test |\n';
const encodeSpring = (token: string) => `data:${token.replaceAll('\n', '\ndata:')}\n\n`;

describe('Bootui', () => {
  let component: Bootui;
  let fixture: ComponentFixture<Bootui>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMarkdown()],
      imports: [Bootui],
    }).compileComponents();
    fixture = TestBed.createComponent(Bootui);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());
  it('shouldRenderStreamedMarkdownAsATableWithoutLosingWhitespace', async () => {
    component.query.set('la liste des clients');
    component.askAgentStream();
    fixture.detectChanges();
    const request = http.expectOne(`${endpoint}?query=la%20liste%20des%20clients`);
    expect(request.request.reportProgress).toBe(true);
    const tokens = [
      'Voici',
      ' la liste',
      ' des clients :',
      markdown.slice('Voici la liste des clients :'.length),
    ];
    const payload = tokens.map(encodeSpring).join('');
    request.event({
      type: HttpEventType.DownloadProgress,
      loaded: payload.length,
      partialText: payload + 'data:incomplet',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('markdown p')?.textContent).toBe('Voici la liste des clients :');
    expect(element.querySelectorAll('markdown thead th').length).toBe(3);
    expect(element.querySelectorAll('markdown tbody tr').length).toBe(2);
    expect(element.textContent).not.toContain('incomplet');
    request.flush(payload);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.pending()).toBe(false);
    expect(element.querySelectorAll('markdown tbody tr').length).toBe(2);
  });
  it('shouldRejectEmptyQuestionsAndPreventDuplicateSubmissions', () => {
    component.query.set('  ');
    component.askAgentStream();
    http.expectNone((request) => request.url === endpoint);
    component.query.set('clients');
    component.askAgentStream();
    component.askAgentStream();
    fixture.detectChanges();
    http.expectOne(`${endpoint}?query=clients`).flush(encodeSpring('OK'));
    expect(component.pending()).toBe(false);
  });
  it('shouldDisplayAnErrorAndAllowRetry', () => {
    component.query.set('clients');
    component.askAgentStream();
    fixture.detectChanges();
    http
      .expectOne(`${endpoint}?query=clients`)
      .flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Réessayez',
    );
    expect(component.pending()).toBe(false);
    component.askAgentStream();
    fixture.detectChanges();
    http.expectOne(`${endpoint}?query=clients`).flush(encodeSpring('Réponse disponible'));
  });
  it('shouldKeepTheNonStreamingEndpointAndSanitizeMarkdownHtml', async () => {
    component.query.set('question');
    component.askAgent();
    fixture.detectChanges();
    http
      .expectOne('http://localhost:9999/EBANK-BOOT/chat?query=question')
      .flush('**Bonjour**\n\n<script>alert(1)</script>');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('markdown strong').textContent).toBe('Bonjour');
    expect(fixture.nativeElement.querySelector('markdown script')).toBeNull();
  });
});
