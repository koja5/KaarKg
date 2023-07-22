import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePersonalInfoComponent } from './change-personal-info.component';

describe('ChangePersonalInfoComponent', () => {
  let component: ChangePersonalInfoComponent;
  let fixture: ComponentFixture<ChangePersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePersonalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
