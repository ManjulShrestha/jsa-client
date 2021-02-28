import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobtitleComponent} from './jobtitle.component';

describe('JobtitleComponent', () => {
  let component: JobtitleComponent;
  let fixture: ComponentFixture<JobtitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobtitleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
