import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightCardComponent } from './right-card.component';

describe('RightCardComponent', () => {
  let component: RightCardComponent;
  let fixture: ComponentFixture<RightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
