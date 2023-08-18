import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailVerifyDealerConfigComponent } from './mail-verify-dealer-config.component';

describe('MailVerifyDealerConfigComponent', () => {
  let component: MailVerifyDealerConfigComponent;
  let fixture: ComponentFixture<MailVerifyDealerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailVerifyDealerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailVerifyDealerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
