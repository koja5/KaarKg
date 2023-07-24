import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPricesComponent } from './shipping-prices.component';

describe('ShippingPriceComponent', () => {
  let component: ShippingPricesComponent;
  let fixture: ComponentFixture<ShippingPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingPricesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
