import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading =signal<boolean> (false);
  public isloading = this.loading.asReadonly();
  public setLoading(loading: boolean) {
    this.loading.set(loading);
  }

}
