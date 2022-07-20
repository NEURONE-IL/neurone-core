import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroneFormsComponent } from './neurone-forms.component';

describe('NeuroneFormsComponent', () => {
  let component: NeuroneFormsComponent;
  let fixture: ComponentFixture<NeuroneFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroneFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroneFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
