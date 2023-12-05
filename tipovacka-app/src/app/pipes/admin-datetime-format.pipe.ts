import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';

@Pipe({
  name: 'adminDatetimeFormatBy',
  standalone: true,
})
export class AdminDatetimeFormatPipe implements PipeTransform {

  transform(date: Date): string | null {
    return formatDate(date, "YYYY-MM-ddTHH:mm", 'cs', undefined);
  }
}
