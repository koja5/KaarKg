import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdditionalAmountComponent } from './payment-additional-amount.component';

describe('PaymentAdditionalAmountComponent', () => {
  let component: PaymentAdditionalAmountComponent;
  let fixture: ComponentFixture<PaymentAdditionalAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAdditionalAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAdditionalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
