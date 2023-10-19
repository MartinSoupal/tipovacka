import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-result-button',
  templateUrl: './result-button.component.html',
  styleUrls: ['./result-button.component.scss']
})
export class ResultButtonComponent {
  @Input() backgroundColor: string | undefined;
  @Input() highlight: boolean = false;
  @Input() hide: boolean = false;
  @Input() label: string | undefined;
}
