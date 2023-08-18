import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailVerifyKindergardenConfigComponent } from './mail-verify-kindergarden-config.component';

describe('MailVerifyKindergardenConfigComponent', () => {
  let component: MailVerifyKindergardenConfigComponent;
  let fixture: ComponentFixture<MailVerifyKindergardenConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailVerifyKindergardenConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailVerifyKindergardenConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
