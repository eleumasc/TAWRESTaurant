import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTablesPageComponent } from './free-tables-page.component';

describe('FreeTablesPageComponent', () => {
  let component: FreeTablesPageComponent;
  let fixture: ComponentFixture<FreeTablesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeTablesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTablesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
