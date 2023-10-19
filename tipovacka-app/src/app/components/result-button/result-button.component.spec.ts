import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResultButtonComponent} from './result-button.component';

describe('TeamComponent', () => {
  let component: ResultButtonComponent;
  let fixture: ComponentFixture<ResultButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultButtonComponent]
    });
    fixture = TestBed.createComponent(ResultButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
