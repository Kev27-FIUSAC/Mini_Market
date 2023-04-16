import { TestBed } from '@angular/core/testing';

import { MaterialModuleService } from './material-module.service';

describe('MaterialModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialModuleService = TestBed.get(MaterialModuleService);
    expect(service).toBeTruthy();
  });
});
