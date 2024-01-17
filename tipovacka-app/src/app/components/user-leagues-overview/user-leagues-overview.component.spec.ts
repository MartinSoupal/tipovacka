import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserLeaguesOverviewComponent} from './user-leagues-overview.component';

describe('CreateUserLeagueComponent', () => {
  let component: UserLeaguesOverviewComponent;
  let fixture: ComponentFixture<UserLeaguesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLeaguesOverviewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserLeaguesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
