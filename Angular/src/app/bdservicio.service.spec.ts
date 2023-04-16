import { TestBed } from '@angular/core/testing';

import { BDServicioService } from './bdservicio.service';

describe('BDServicioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BDServicioService = TestBed.get(BDServicioService);
    expect(service).toBeTruthy();
  });
});
