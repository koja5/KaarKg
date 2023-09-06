import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverBackgroundComponent } from './cover-background.component';

describe('CoverBackgroundComponent', () => {
  let component: CoverBackgroundComponent;
  let fixture: ComponentFixture<CoverBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverBackgroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
