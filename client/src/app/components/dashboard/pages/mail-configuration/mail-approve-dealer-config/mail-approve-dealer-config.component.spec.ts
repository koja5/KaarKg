import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailApproveDealerConfigComponent } from './mail-approve-dealer-config.component';

describe('MailApproveDealerConfigComponent', () => {
  let component: MailApproveDealerConfigComponent;
  let fixture: ComponentFixture<MailApproveDealerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailApproveDealerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailApproveDealerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
