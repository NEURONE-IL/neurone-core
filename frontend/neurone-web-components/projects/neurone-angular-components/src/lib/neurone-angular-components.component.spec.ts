import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroneAngularComponentsComponent } from './neurone-angular-components.component';

describe('NeuroneAngularComponentsComponent', () => {
  let component: NeuroneAngularComponentsComponent;
  let fixture: ComponentFixture<NeuroneAngularComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroneAngularComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroneAngularComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
