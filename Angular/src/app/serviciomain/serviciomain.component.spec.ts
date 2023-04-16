import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciomainComponent } from './serviciomain.component';

describe('ServiciomainComponent', () => {
  let component: ServiciomainComponent;
  let fixture: ComponentFixture<ServiciomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
