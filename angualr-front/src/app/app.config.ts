import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { loadingInterceptorInterceptor } from './interceptors/loading-interceptor-interceptor';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([loadingInterceptorInterceptor])),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideMarkdown(),
  ],
};
