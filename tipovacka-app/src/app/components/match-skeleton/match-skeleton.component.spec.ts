import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSkeletonComponent } from './match-skeleton.component';

describe('MatchSkeletonComponent', () => {
  let component: MatchSkeletonComponent;
  let fixture: ComponentFixture<MatchSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchSkeletonComponent]
    });
    fixture = TestBed.createComponent(MatchSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
