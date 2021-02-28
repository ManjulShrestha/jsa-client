import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCandidateComponent } from './sidebar-candidate.component';

describe('SidebarCandidateComponent', () => {
  let component: SidebarCandidateComponent;
  let fixture: ComponentFixture<SidebarCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
