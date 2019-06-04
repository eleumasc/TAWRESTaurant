import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavsPagesComponent } from './navs-pages.component';

describe('NavsPagesComponent', () => {
  let component: NavsPagesComponent;
  let fixture: ComponentFixture<NavsPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavsPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
