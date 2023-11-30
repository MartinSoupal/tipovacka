import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesOverviewComponent } from './matches-overview.component';

describe('MatchesOverviewComponent', () => {
  let component: MatchesOverviewComponent;
  let fixture: ComponentFixture<MatchesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchesOverviewComponent]
    });
    fixture = TestBed.createComponent(MatchesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
