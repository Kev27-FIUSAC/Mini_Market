import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmoComponent } from './admo.component';

describe('AdmoComponent', () => {
  let component: AdmoComponent;
  let fixture: ComponentFixture<AdmoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
