import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderContentComponent } from './order-content.component';

describe('OrderContentComponent', () => {
  let component: OrderContentComponent;
  let fixture: ComponentFixture<OrderContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
