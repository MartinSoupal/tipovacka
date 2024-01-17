import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appImgSrcError]'
})
export class ImageSrcErrorDirective {
  @Input({required: true}) appImgSrcError!: string;

  constructor(private el: ElementRef) {
  }

  @HostListener('error')
  loadImageError() {
    const element: HTMLImageElement = this.el.nativeElement;
    element.src = this.appImgSrcError;
  }
}
