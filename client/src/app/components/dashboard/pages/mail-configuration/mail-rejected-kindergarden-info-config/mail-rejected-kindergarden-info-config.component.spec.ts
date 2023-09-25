import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailRejectedKindergardenInfoConfigComponent } from './mail-rejected-kindergarden-info-config.component';

describe('MailRejectedKindergardenInfoConfigComponent', () => {
  let component: MailRejectedKindergardenInfoConfigComponent;
  let fixture: ComponentFixture<MailRejectedKindergardenInfoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailRejectedKindergardenInfoConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailRejectedKindergardenInfoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
