import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailResetPasswordConfigComponent } from './mail-reset-password-config.component';

describe('MailResetPasswordConfigComponent', () => {
  let component: MailResetPasswordConfigComponent;
  let fixture: ComponentFixture<MailResetPasswordConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailResetPasswordConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailResetPasswordConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
