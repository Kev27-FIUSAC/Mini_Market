import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteiComponent } from './clientei.component';

describe('ClienteiComponent', () => {
  let component: ClienteiComponent;
  let fixture: ComponentFixture<ClienteiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
