import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderContentComponent } from './loader-content.component';

describe('LoaderContentComponent', () => {
  let component: LoaderContentComponent;
  let fixture: ComponentFixture<LoaderContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
