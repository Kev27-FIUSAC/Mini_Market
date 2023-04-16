import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmoUsersComponent } from './admo-users.component';

describe('AdmoUsersComponent', () => {
  let component: AdmoUsersComponent;
  let fixture: ComponentFixture<AdmoUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmoUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmoUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
