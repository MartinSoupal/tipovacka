import {Directive, HostListener} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[swipeGesture]'
})
export class SwipeGestureDirective {
  private startX = 0;
  private startY = 0;
  private threshold = 150;

  constructor() {
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    this.handleSwipeGesture(endX, endY);
  }

  private handleSwipeGesture(endX: number, endY: number) {
    const diffX = endX - this.startX;
    const diffY = endY - this.startY;

    if (Math.abs(diffX) >= this.threshold && Math.abs(diffY) <= 200) {
      if (diffX > 0) {
        dispatchEvent(new CustomEvent('swipeRight'))
      } else {
        dispatchEvent(new CustomEvent('swipeLeft'))
      }
    }
  }
}
