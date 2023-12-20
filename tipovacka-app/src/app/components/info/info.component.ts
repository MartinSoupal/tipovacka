import {Component, inject} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {TranslocoPipe} from '@ngneat/transloco';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    TranslocoPipe
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  ref: DialogRef<void, undefined> = inject(DialogRef);
}
