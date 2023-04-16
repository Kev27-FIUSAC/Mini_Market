import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmoUserComponent } from './admo-user.component';

describe('AdmoUserComponent', () => {
  let component: AdmoUserComponent;
  let fixture: ComponentFixture<AdmoUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmoUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
