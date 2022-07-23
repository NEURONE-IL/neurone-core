import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroneSerpComponent } from './neurone-serp.component';

describe('NeuroneSerpComponent', () => {
  let component: NeuroneSerpComponent;
  let fixture: ComponentFixture<NeuroneSerpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroneSerpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroneSerpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
