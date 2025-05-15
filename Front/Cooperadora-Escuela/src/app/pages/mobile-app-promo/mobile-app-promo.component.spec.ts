import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppPromoComponent } from './mobile-app-promo.component';

describe('MobileAppPromoComponent', () => {
  let component: MobileAppPromoComponent;
  let fixture: ComponentFixture<MobileAppPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAppPromoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileAppPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
