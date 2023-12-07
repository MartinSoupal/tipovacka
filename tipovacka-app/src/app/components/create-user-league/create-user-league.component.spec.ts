import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserLeagueComponent } from './create-user-league.component';

describe('CreateUserLeagueComponent', () => {
  let component: CreateUserLeagueComponent;
  let fixture: ComponentFixture<CreateUserLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserLeagueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUserLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
