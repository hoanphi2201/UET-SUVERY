/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WindowresizeService } from './windowresize.service';

describe('Service: Windowresize', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowresizeService]
    });
  });

  it('should ...', inject([WindowresizeService], (service: WindowresizeService) => {
    expect(service).toBeTruthy();
  }));
});
