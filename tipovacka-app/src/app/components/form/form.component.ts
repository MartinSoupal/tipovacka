import {Component, Input} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ]
})
export class FormComponent {
  form: string[] = [];

  @Input()
  set data(value: string) {
    this.form = value.substring(0, 5).split('');
  }
}
