import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterTablesPageComponent } from './waiter-tables-page.component';

describe('WaiterTablesPageComponent', () => {
  let component: WaiterTablesPageComponent;
  let fixture: ComponentFixture<WaiterTablesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterTablesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterTablesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
