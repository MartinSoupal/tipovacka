import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UsersForUserLeagueComponent} from './users-for-user-league.component';

describe('CreateUserLeagueComponent', () => {
  let component: UsersForUserLeagueComponent;
  let fixture: ComponentFixture<UsersForUserLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersForUserLeagueComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersForUserLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
