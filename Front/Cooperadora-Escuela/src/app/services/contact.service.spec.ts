import { TestBed } from '@angular/core/testing';

import { ContactoService } from './contact.service';

describe('ContactService', () => {
  let service: ContactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
