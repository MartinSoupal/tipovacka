import {Component, Input} from '@angular/core';
import {DecimalPipe, NgClass, NgIf} from '@angular/common';

export type ResultButtonType = 'normal' | 'highlight' | 'correct' | 'incorrect';

@Component({
  selector: 'app-result-button',
  templateUrl: './result-button.component.html',
  styleUrls: ['./result-button.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    DecimalPipe,
    NgIf
  ]
})
export class ResultButtonComponent {
  @Input() backgroundColor: string | undefined;
  @Input() hide: boolean = false;
  @Input() hover: boolean = true;
  @Input() label: string | undefined;
  @Input() votesRatio: number = 0;
  @Input() type: ResultButtonType = 'normal';
  @Input() size: 'normal' | 'small' = 'normal';
}
