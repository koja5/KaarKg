import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderSvgComponent } from './loader-svg.component';

describe('LoaderSvgComponent', () => {
  let component: LoaderSvgComponent;
  let fixture: ComponentFixture<LoaderSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
