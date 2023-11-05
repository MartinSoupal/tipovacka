import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextMatchesComponent } from './next-matches.component';

describe('NextMatchesComponent', () => {
  let component: NextMatchesComponent;
  let fixture: ComponentFixture<NextMatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NextMatchesComponent]
    });
    fixture = TestBed.createComponent(NextMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
