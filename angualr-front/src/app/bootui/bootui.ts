import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { catchError, filter, finalize, map, Observable, of, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { parseSpringSse } from './spring-sse';

interface ChatResponse {
  type: 'sent' | 'download' | 'response' | 'error';
  content: string;
}

@Component({
  selector: 'app-bootui',
  imports: [FormsModule, AsyncPipe, MarkdownComponent],
  templateUrl: './bootui.html',
  styleUrl: './bootui.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bootui {
  private readonly http = inject(HttpClient);
  readonly query = signal('');
  readonly pending = signal(false);
  response$: Observable<ChatResponse> | null = null;

  askAgent(): void {
    this.ask(false);
  }
  askAgentStream(): void {
    this.ask(true);
  }

  private ask(stream: boolean): void {
    const query = this.query().trim();
    if (!query || this.pending()) return;
    this.pending.set(true);
    const url = `http://localhost:9999/EBANK-BOOT/${stream ? 'chatStream' : 'chat'}?query=${encodeURIComponent(query)}`;
    const response: Observable<ChatResponse> = stream
      ? this.http.get(url, { responseType: 'text', observe: 'events', reportProgress: true }).pipe(
          filter(
            (event) =>
              event.type === HttpEventType.Response ||
              (event.type === HttpEventType.DownloadProgress &&
                typeof event.partialText === 'string'),
          ),
          map((event) => {
            if (event.type === HttpEventType.Response) {
              return { type: 'response', content: parseSpringSse(event.body ?? '') };
            }
            return {
              type: 'download',
              content:
                event.type === HttpEventType.DownloadProgress
                  ? parseSpringSse(event.partialText ?? '')
                  : '',
            };
          }),
        )
      : this.http
          .get(url, { responseType: 'text' })
          .pipe(map((content) => ({ type: 'response', content })));
    this.response$ = response.pipe(
      startWith({ type: 'sent', content: '' } as ChatResponse),
      catchError(() =>
        of<ChatResponse>({
          type: 'error',
          content: 'La réponse n’a pas pu être chargée. Réessayez dans quelques instants.',
        }),
      ),
      finalize(() => this.pending.set(false)),
    );
  }
}
