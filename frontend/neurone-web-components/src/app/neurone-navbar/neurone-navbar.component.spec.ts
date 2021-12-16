import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroneNavbarComponent } from './neurone-navbar.component';

describe('NeuroneNavbarComponent', () => {
  let component: NeuroneNavbarComponent;
  let fixture: ComponentFixture<NeuroneNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroneNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroneNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
