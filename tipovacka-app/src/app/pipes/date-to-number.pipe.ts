import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateToNumber',
  pure: false,
  standalone: true,
})
export class DateToNumberPipe implements PipeTransform {

  transform(date: Date): number {
    return date.getTime();
  }
}
