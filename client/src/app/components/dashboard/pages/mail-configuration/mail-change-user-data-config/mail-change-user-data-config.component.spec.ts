import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailChangeUserDataConfigComponent } from './mail-change-user-data-config.component';

describe('MailChangeUserDataConfigComponent', () => {
  let component: MailChangeUserDataConfigComponent;
  let fixture: ComponentFixture<MailChangeUserDataConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailChangeUserDataConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailChangeUserDataConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
