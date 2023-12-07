import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChooseUserLeagueComponent} from './choose-user-league.component';

describe('CreateUserLeagueComponent', () => {
  let component: ChooseUserLeagueComponent;
  let fixture: ComponentFixture<ChooseUserLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseUserLeagueComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChooseUserLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
