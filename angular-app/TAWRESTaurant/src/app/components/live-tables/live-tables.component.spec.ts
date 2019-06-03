import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTablesComponent } from './live-tables.component';

describe('LiveTablesComponent', () => {
  let component: LiveTablesComponent;
  let fixture: ComponentFixture<LiveTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
