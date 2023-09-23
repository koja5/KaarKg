import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoProductsAvailableComponent } from './no-products-available.component';

describe('NoProductsAvailableComponent', () => {
  let component: NoProductsAvailableComponent;
  let fixture: ComponentFixture<NoProductsAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoProductsAvailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoProductsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
