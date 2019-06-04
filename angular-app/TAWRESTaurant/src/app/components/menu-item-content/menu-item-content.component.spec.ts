import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemContentComponent } from './menu-item-content.component';

describe('MenuItemContentComponent', () => {
  let component: MenuItemContentComponent;
  let fixture: ComponentFixture<MenuItemContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuItemContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
