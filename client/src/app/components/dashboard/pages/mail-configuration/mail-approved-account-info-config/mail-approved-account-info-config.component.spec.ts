import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailApprovedAccountInfoConfigComponent } from './mail-approved-account-info-config.component';

describe('MailApprovedAccountInfoConfigComponent', () => {
  let component: MailApprovedAccountInfoConfigComponent;
  let fixture: ComponentFixture<MailApprovedAccountInfoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailApprovedAccountInfoConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailApprovedAccountInfoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
