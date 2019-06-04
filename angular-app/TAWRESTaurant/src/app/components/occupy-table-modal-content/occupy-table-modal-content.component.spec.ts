import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupyTableModalContentComponent } from './occupy-table-modal-content.component';

describe('OccupyTableModalContentComponent', () => {
  let component: OccupyTableModalContentComponent;
  let fixture: ComponentFixture<OccupyTableModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupyTableModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupyTableModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
