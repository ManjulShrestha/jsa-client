import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExperienceRangeComponent} from './experience-range.component';

describe('ExperienceRangeComponent', () => {
  let component: ExperienceRangeComponent;
  let fixture: ComponentFixture<ExperienceRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceRangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
