import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';

@Pipe({
  name: 'datetimeFormatBy',
  pure: false,
  standalone: true,
})
export class DatetimeFormatPipe implements PipeTransform {

  constructor(
    private translocoSerice: TranslocoService,
  ) {
  }

  transform(date: Date): string | null {
    const activeLang = this.translocoSerice.getActiveLang();
    switch (activeLang) {
      case 'cs':
        return formatDate(date, "d.M. 'v' H:mm", 'cs', undefined);
      case 'en':
        return formatDate(date, "d/M 'at' H:mm", 'en', undefined);
      default:
        return formatDate(date, "d.M. 'v' H:mm", 'cs', undefined);
    }
  }
}
