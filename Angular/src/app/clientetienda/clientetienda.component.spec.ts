import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientetiendaComponent } from './clientetienda.component';

describe('ClientetiendaComponent', () => {
  let component: ClientetiendaComponent;
  let fixture: ComponentFixture<ClientetiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientetiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientetiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
