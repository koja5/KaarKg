import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailInvoiceCustomerConfigComponent } from './mail-invoice-customer-config.component';

describe('MailInvoiceCustomerConfigComponent', () => {
  let component: MailInvoiceCustomerConfigComponent;
  let fixture: ComponentFixture<MailInvoiceCustomerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailInvoiceCustomerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailInvoiceCustomerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
