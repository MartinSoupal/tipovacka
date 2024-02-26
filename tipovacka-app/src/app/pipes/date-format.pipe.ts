import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';

@Pipe({
  name: 'dateFormat',
  pure: false,
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {

  constructor(
    private translocoSerice: TranslocoService,
  ) {
  }

  transform(date: Date): string | null {
    const activeLang = this.translocoSerice.getActiveLang();
    switch (activeLang) {
      case 'cs':
        return formatDate(date, "EEEE, d.M.YYYY", 'cs', undefined);
      case 'en':
        return formatDate(date, "EEEE, d/M/YYYY", 'en', undefined);
      default:
        return formatDate(date, "EEEE, d.M.YYYY", 'cs', undefined);
    }
  }
}
