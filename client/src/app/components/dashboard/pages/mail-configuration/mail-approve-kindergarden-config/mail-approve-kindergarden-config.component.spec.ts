import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailApproveKindergardenConfigComponent } from './mail-approve-kindergarden-config.component';

describe('MailApproveKindergardenConfigComponent', () => {
  let component: MailApproveKindergardenConfigComponent;
  let fixture: ComponentFixture<MailApproveKindergardenConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailApproveKindergardenConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailApproveKindergardenConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
