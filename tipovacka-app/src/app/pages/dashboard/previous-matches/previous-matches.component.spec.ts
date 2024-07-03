import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousMatchesComponent } from './previous-matches.component';

describe('PreviousMatchesComponent', () => {
  let component: PreviousMatchesComponent;
  let fixture: ComponentFixture<PreviousMatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviousMatchesComponent]
    });
    fixture = TestBed.createComponent(PreviousMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
