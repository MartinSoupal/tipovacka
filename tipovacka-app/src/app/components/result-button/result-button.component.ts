import {Component, Input} from '@angular/core';

export type ResultButtonType = 'normal' | 'highlight' | 'correct' | 'incorrect';

@Component({
  selector: 'app-result-button',
  templateUrl: './result-button.component.html',
  styleUrls: ['./result-button.component.scss']
})
export class ResultButtonComponent {
  @Input() backgroundColor: string | undefined;
  @Input() hide: boolean = false;
  @Input() label: string | undefined;
  @Input() votesRatio: number = 0;
  @Input() type: ResultButtonType = 'normal';
  @Input() size: 'normal' | 'small' = 'normal';
}
