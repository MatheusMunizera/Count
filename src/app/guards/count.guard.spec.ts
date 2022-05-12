import { TestBed } from '@angular/core/testing';

import { CountGuard } from './count.guard';

describe('CountGuard', () => {
  let guard: CountGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
