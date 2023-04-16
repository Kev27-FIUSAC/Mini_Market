import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientecargaComponent } from './clientecarga.component';

describe('ClientecargaComponent', () => {
  let component: ClientecargaComponent;
  let fixture: ComponentFixture<ClientecargaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientecargaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientecargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
