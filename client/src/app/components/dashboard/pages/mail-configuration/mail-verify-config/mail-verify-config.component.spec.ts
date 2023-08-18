import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailVerifyConfigComponent } from './mail-verify-config.component';

describe('MailSignupConfigComponent', () => {
  let component: MailVerifyConfigComponent;
  let fixture: ComponentFixture<MailVerifyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailVerifyConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailVerifyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
