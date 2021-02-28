import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AgerangeComponent} from './agerange.component';

describe('AgerangeComponent', () => {
  let component: AgerangeComponent;
  let fixture: ComponentFixture<AgerangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgerangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgerangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
