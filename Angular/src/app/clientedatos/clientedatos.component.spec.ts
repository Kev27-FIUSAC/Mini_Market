import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientedatosComponent } from './clientedatos.component';

describe('ClientedatosComponent', () => {
  let component: ClientedatosComponent;
  let fixture: ComponentFixture<ClientedatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientedatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientedatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
