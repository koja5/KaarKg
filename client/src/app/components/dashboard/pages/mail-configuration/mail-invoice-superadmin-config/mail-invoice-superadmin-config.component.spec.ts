import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailInvoiceSuperadminConfigComponent } from './mail-invoice-superadmin-config.component';

describe('MailInvoiceSuperadminConfigComponent', () => {
  let component: MailInvoiceSuperadminConfigComponent;
  let fixture: ComponentFixture<MailInvoiceSuperadminConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailInvoiceSuperadminConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailInvoiceSuperadminConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
