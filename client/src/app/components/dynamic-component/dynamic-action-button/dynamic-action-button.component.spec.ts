import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicActionButtonComponent } from './dynamic-action-button.component';

describe('DynamicActionButtonComponent', () => {
  let component: DynamicActionButtonComponent;
  let fixture: ComponentFixture<DynamicActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicActionButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
