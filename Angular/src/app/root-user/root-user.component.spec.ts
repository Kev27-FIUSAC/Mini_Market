import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootUserComponent } from './root-user.component';

describe('RootUserComponent', () => {
  let component: RootUserComponent;
  let fixture: ComponentFixture<RootUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
