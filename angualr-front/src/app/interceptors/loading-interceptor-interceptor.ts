import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import { LoadingService} from '../services/loading';
import {finalize} from 'rxjs';

export const loadingInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let loadingService = inject(LoadingService);
  loadingService.setLoading(true);
  return next(req).pipe(finalize(() => loadingService.setLoading(false)));
};
