import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import {Account, AccountList, RequestStatus} from '../model/accounts.mode';
import {catchError, map, Observable, of} from 'rxjs';

@Component({
  selector: 'app-accounts',
  imports: [
    AsyncPipe
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
  private http = inject(HttpClient);
  accounts$: Observable<AccountList> = this.http
    .get<Account[]>('http://localhost:9999/EBANK-SERVICE/bankAccounts')
    .pipe(
      map((accounts): AccountList => ({
        accounts,
        status: RequestStatus.SUCCESS
      })),
      catchError(() => of<AccountList>({
        accounts: [],
        status: RequestStatus.ERROR,
        errMessage: 'Impossible de charger les comptes. Veuillez réessayer.'
      }))
    );
}
