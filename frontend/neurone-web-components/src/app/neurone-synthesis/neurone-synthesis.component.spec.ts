import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroneSynthesisComponent } from './neurone-synthesis.component';

describe('NeuroneSynthesisComponent', () => {
  let component: NeuroneSynthesisComponent;
  let fixture: ComponentFixture<NeuroneSynthesisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroneSynthesisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroneSynthesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
