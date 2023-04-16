import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciodatosComponent } from './serviciodatos.component';

describe('ServiciodatosComponent', () => {
  let component: ServiciodatosComponent;
  let fixture: ComponentFixture<ServiciodatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciodatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciodatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
