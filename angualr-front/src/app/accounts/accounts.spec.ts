import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Accounts } from './accounts';
import { RequestStatus } from '../model/accounts.mode';

registerLocaleData(localeFr);
const endpoint = 'http://localhost:9999/EBANK-SERVICE/bankAccounts';
const sample = Array.from({ length: 10 }, (_, index) => ({
  id: `account-${index}`,
  balance: index * 100,
  customerID: index % 3,
  createdAt: `2026-01-${String(index + 1).padStart(2, '0')}`,
  type: index % 2 ? 'SAVING' : 'CURRENT',
}));

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accounts],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('shouldLoadAccountsAndDerivePortfolioMetrics', () => {
    expect(component.loading()).toBe(true);
    http.expectOne(endpoint).flush(sample);
    expect(component.totalBalance()).toBe(4500);
    expect(component.customerCount()).toBe(3);
    expect(component.averageBalance()).toBe(450);
    expect(component.distribution().map((group) => group.count)).toEqual([5, 5]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(8);
  });

  it('shouldCombineSearchAndTypeFiltersAndResetPagination', () => {
    http.expectOne(endpoint).flush(sample);
    component.page.set(2);
    component.updateType('SAVING');
    component.updateQuery('account-3');
    expect(component.currentPage()).toBe(1);
    expect(component.filteredAccounts().map((account) => account.id)).toEqual(['account-3']);
    component.updateType('CURRENT');
    expect(component.filteredAccounts()).toEqual([]);
    component.resetFilters();
    expect(component.filteredAccounts().length).toBe(10);
  });

  it('shouldSortAndPaginateWithoutChangingApiData', () => {
    http.expectOne(endpoint).flush(sample);
    component.sort('balance');
    expect(component.visibleAccounts()[0].balance).toBe(900);
    component.page.set(2);
    expect(component.visibleAccounts().length).toBe(2);
    component.sort('balance');
    expect(component.visibleAccounts()[0].balance).toBe(0);
    expect(component.accounts()[0].id).toBe('account-0');
  });

  it('shouldRecoverFromAnApiFailureOnRetry', () => {
    http.expectOne(endpoint).flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(component.state().status).toBe(RequestStatus.ERROR);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'indisponibles',
    );
    component.refresh();
    expect(component.loading()).toBe(true);
    http.expectOne(endpoint).flush(sample);
    expect(component.ready()).toBe(true);
  });

  it('shouldHandleAnEmptyPortfolioAndMissingFields', () => {
    http.expectOne(endpoint).flush([]);
    expect(component.averageBalance()).toBe(0);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aucun compte disponible');
    component.refresh();
    http.expectOne(endpoint).flush([{ id: 'missing', createdAt: 'invalid' }]);
    expect(component.dateValue('invalid')).toBeNull();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Non renseigné');
  });
});
