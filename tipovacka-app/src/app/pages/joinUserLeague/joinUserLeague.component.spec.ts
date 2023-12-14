import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JoinUserLeagueComponent} from './joinUserLeague.component';

describe('AdminComponent', () => {
  let component: JoinUserLeagueComponent;
  let fixture: ComponentFixture<JoinUserLeagueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinUserLeagueComponent]
    });
    fixture = TestBed.createComponent(JoinUserLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
