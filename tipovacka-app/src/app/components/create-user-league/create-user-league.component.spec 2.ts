import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserLeagueComponent } from './create-user-league.component';

describe('CreateUserLeagueComponent', () => {
  let component: CreateUserLeagueComponent;
  let fixture: ComponentFixture<CreateUserLeagueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUserLeagueComponent]
    });
    fixture = TestBed.createComponent(CreateUserLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
