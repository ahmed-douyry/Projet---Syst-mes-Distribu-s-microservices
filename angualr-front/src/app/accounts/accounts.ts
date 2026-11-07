import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { Account, AccountList, RequestStatus } from '../model/accounts.mode';
import { AccountsApi } from '../services/accounts-api';
import { PortfolioInsights } from '../components/portfolio-insights/portfolio-insights';
import { MetricCard } from '../components/metric-card/metric-card';

type SortKey = 'createdAt' | 'balance' | 'id';
const loadingState: AccountList = { accounts: [], status: RequestStatus.LOADING };

@Component({
  selector: 'app-accounts',
  imports: [DatePipe, DecimalPipe, MetricCard, PortfolioInsights],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts {
  private readonly api = inject(AccountsApi);
  private readonly refreshTrigger = new Subject<void>();
  readonly requestStatus = RequestStatus;
  readonly state = toSignal(
    this.refreshTrigger.pipe(
      startWith(undefined),
      switchMap(() =>
        this.api.list().pipe(
          map((accounts): AccountList => ({ accounts, status: RequestStatus.SUCCESS })),
          catchError(() =>
            of<AccountList>({
              accounts: [],
              status: RequestStatus.ERROR,
              errMessage:
                'Impossible de charger les comptes. Vérifiez la disponibilité du service et réessayez.',
            }),
          ),
          startWith(loadingState),
        ),
      ),
    ),
    { initialValue: loadingState },
  );
  readonly query = signal('');
  readonly selectedType = signal('');
  readonly sortKey = signal<SortKey>('createdAt');
  readonly descending = signal(true);
  readonly page = signal(1);
  readonly pageSize = 8;
  readonly exportMessage = signal('');
  readonly accounts = computed(() => this.state().accounts);
  readonly loading = computed(() => this.state().status === RequestStatus.LOADING);
  readonly ready = computed(() => this.state().status === RequestStatus.SUCCESS);
  readonly types = computed(() =>
    [
      ...new Set(
        this.accounts()
          .map((a) => a.type)
          .filter((t): t is string => !!t),
      ),
    ].sort(),
  );
  readonly totalBalance = computed(() =>
    this.accounts().reduce((sum, a) => sum + (a.balance ?? 0), 0),
  );
  readonly customerCount = computed(
    () =>
      new Set(
        this.accounts()
          .map((a) => a.customerID)
          .filter((id) => id != null),
      ).size,
  );
  readonly averageBalance = computed(() =>
    this.accounts().length ? this.totalBalance() / this.accounts().length : 0,
  );
  readonly filteredAccounts = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('fr');
    const key = this.sortKey();
    const direction = this.descending() ? -1 : 1;
    return this.accounts()
      .filter(
        (a) =>
          (!this.selectedType() || a.type === this.selectedType()) &&
          (!query ||
            [a.id, a.customerID, a.type].some((value) =>
              String(value ?? '')
                .toLocaleLowerCase('fr')
                .includes(query),
            )),
      )
      .sort((a, b) => {
        if (key === 'id') return direction * (a.id ?? '').localeCompare(b.id ?? '');
        if (key === 'balance') return direction * ((a.balance ?? 0) - (b.balance ?? 0));
        return (
          direction * ((this.dateValue(a.createdAt) ?? 0) - (this.dateValue(b.createdAt) ?? 0))
        );
      });
  });
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredAccounts().length / this.pageSize)),
  );
  readonly currentPage = computed(() => Math.min(this.page(), this.pageCount()));
  readonly pageStart = computed(() => (this.currentPage() - 1) * this.pageSize);
  readonly visibleAccounts = computed(() =>
    this.filteredAccounts().slice(this.pageStart(), this.pageStart() + this.pageSize),
  );
  readonly pageEnd = computed(() =>
    Math.min(this.pageStart() + this.pageSize, this.filteredAccounts().length),
  );
  readonly distribution = computed(() => {
    const groups = new Map<string, number>();
    for (const account of this.accounts()) {
      const type = account.type || 'Non renseigné';
      groups.set(type, (groups.get(type) ?? 0) + 1);
    }
    return [...groups]
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / this.accounts().length) * 100,
      }));
  });
  readonly metrics = computed(() => {
    const format = (value: number, decimals = 0) =>
      this.ready()
        ? new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(value)
        : '—';
    return [
      {
        label: 'Solde total',
        value: format(this.totalBalance(), 2),
        description: 'Somme des soldes des comptes',
        icon: 'bi-wallet2',
        featured: true,
      },
      {
        label: 'Comptes bancaires',
        value: format(this.accounts().length),
        description: 'Comptes dans votre portefeuille',
        icon: 'bi-credit-card',
        featured: false,
      },
      {
        label: 'Clients associés',
        value: format(this.customerCount()),
        description: 'Identifiants clients distincts',
        icon: 'bi-people',
        featured: false,
      },
      {
        label: 'Solde moyen',
        value: format(this.averageBalance(), 2),
        description: 'Moyenne par compte bancaire',
        icon: 'bi-bar-chart',
        featured: false,
      },
    ];
  });

  refresh(): void {
    this.exportMessage.set('');
    this.refreshTrigger.next();
  }
  updateQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
    this.exportMessage.set('');
  }
  updateType(value: string): void {
    this.selectedType.set(value);
    this.page.set(1);
    this.exportMessage.set('');
  }
  resetFilters(): void {
    this.query.set('');
    this.selectedType.set('');
    this.page.set(1);
    this.exportMessage.set('');
  }
  sort(key: SortKey): void {
    if (this.sortKey() === key) this.descending.update((value) => !value);
    else {
      this.sortKey.set(key);
      this.descending.set(key !== 'id');
    }
    this.page.set(1);
  }
  sortDirection(key: SortKey): 'ascending' | 'descending' | 'none' {
    return this.sortKey() === key ? (this.descending() ? 'descending' : 'ascending') : 'none';
  }
  dateValue(value: Account['createdAt']): number | null {
    if (!value) return null;
    const date = new Date(value).getTime();
    return Number.isFinite(date) ? date : null;
  }
  exportCsv(): void {
    if (!this.ready() || !this.filteredAccounts().length) return;
    // Quote every field and neutralize spreadsheet formula prefixes in text cells.
    const cell = (value: unknown) => {
      const raw = String(value ?? '');
      const safe = typeof value === 'string' && /^[\s]*[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const rows: unknown[][] = [
      ['ID', 'Solde', 'Date de création', 'Type', 'ID client'],
      ...this.filteredAccounts().map((a) => [a.id, a.balance, a.createdAt, a.type, a.customerID]),
    ];
    const blob = new Blob(['\uFEFF' + rows.map((row) => row.map(cell).join(';')).join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ebank-comptes.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.exportMessage.set(`${this.filteredAccounts().length} compte(s) exporté(s).`);
  }
}
