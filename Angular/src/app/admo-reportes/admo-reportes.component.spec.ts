import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmoReportesComponent } from './admo-reportes.component';

describe('AdmoReportesComponent', () => {
  let component: AdmoReportesComponent;
  let fixture: ComponentFixture<AdmoReportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmoReportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmoReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
