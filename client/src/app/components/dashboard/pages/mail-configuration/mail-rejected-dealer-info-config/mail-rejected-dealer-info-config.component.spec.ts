import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailRejectedDealerInfoConfigComponent } from './mail-rejected-dealer-info-config.component';

describe('MailRejectedDealerInfoConfigComponent', () => {
  let component: MailRejectedDealerInfoConfigComponent;
  let fixture: ComponentFixture<MailRejectedDealerInfoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailRejectedDealerInfoConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailRejectedDealerInfoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
