import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpDownloadProgressEvent, HttpEventType} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MarkdownComponent} from 'ngx-markdown';
import {LoadingService} from '../services/loading';

@Component({
  selector: 'app-bootui',
  imports: [
    FormsModule,
    AsyncPipe,
    MarkdownComponent
  ],
  templateUrl: './bootui.html',
  styleUrl: './bootui.css',
})
export class Bootui {
  http = inject(HttpClient);
  query:any;
  public loadingService = inject(LoadingService);
  response$!: Observable<{type: string, content?: string}>;

  askAgent() {
    this.response$ = this.http.get("http://localhost:9999/EBANK-BOOT/chat?query=" + encodeURIComponent(this.query),
        {responseType: 'text'}).pipe(
          map(content => ({type: "response", content}))
        );
  }

  askAgentStream() {
    this.response$ = this.http.get(
        "http://localhost:9999/EBANK-BOOT/chatStream?query=" + encodeURIComponent(this.query),
        {responseType: 'text', observe: "events", reportProgress: true}
    ).pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              return {type: "sent"};
            case HttpEventType.DownloadProgress:
              return {
                type: "download",
                content: this.parseSse((event as HttpDownloadProgressEvent).partialText ?? '')
              };
            case HttpEventType.Response:
              return {type: "response", content: this.parseSse(event.body ?? '')};
            default:
              return {type: "other"};
          }
        })
    );
  }

  private parseSse(payload: string): string {
    return payload
        .split(/\r?\n\r?\n/)
        .flatMap(event => event
          .split(/\r?\n/)
          .filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).replace(/^ /, '')))
        .join('');
  }
}
