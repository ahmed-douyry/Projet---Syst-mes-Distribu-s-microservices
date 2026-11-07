import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bootui } from './bootui';

describe('Bootui', () => {
  let component: Bootui;
  let fixture: ComponentFixture<Bootui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bootui],
    }).compileComponents();

    fixture = TestBed.createComponent(Bootui);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
