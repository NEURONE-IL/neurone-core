import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCheckboxComponent } from './multiple-checkbox.component';

describe('MultipleCheckboxComponent', () => {
  let component: MultipleCheckboxComponent;
  let fixture: ComponentFixture<MultipleCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
