import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillModalContentComponent } from './bill-modal-content.component';

describe('BillModalContentComponent', () => {
  let component: BillModalContentComponent;
  let fixture: ComponentFixture<BillModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
