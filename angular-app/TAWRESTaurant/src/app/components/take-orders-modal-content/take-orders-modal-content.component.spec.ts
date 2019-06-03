import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeOrdersModalContentComponent } from './take-orders-modal-content.component';

describe('TakeOrdersModalContentComponent', () => {
  let component: TakeOrdersModalContentComponent;
  let fixture: ComponentFixture<TakeOrdersModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeOrdersModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeOrdersModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
