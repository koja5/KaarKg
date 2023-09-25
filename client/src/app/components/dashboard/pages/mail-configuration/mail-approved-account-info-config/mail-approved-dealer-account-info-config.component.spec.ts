import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailApprovedDealerAccountInfoConfigComponent } from './mail-approved-dealer-account-info-config.component';

describe('MailApprovedAccountInfoConfigComponent', () => {
  let component: MailApprovedDealerAccountInfoConfigComponent;
  let fixture: ComponentFixture<MailApprovedDealerAccountInfoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailApprovedDealerAccountInfoConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      MailApprovedDealerAccountInfoConfigComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
