import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailApprovedKindergardenInfoConfigComponent } from './mail-approved-kindergarden-info-config.component';

describe('MailApprovedKindergardenInfoConfigComponent', () => {
  let component: MailApprovedKindergardenInfoConfigComponent;
  let fixture: ComponentFixture<MailApprovedKindergardenInfoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailApprovedKindergardenInfoConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailApprovedKindergardenInfoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
