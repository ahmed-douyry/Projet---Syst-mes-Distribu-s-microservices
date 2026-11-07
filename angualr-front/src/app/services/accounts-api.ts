import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../model/accounts.mode';

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private readonly http = inject(HttpClient);

  list(): Observable<Account[]> {
    return this.http.get<Account[]>('http://localhost:9999/EBANK-SERVICE/bankAccounts');
  }
}
