import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe implements PipeTransform {

  transform<T>(array: T[], properties: (keyof T)[], order: 'asc' | 'desc' = 'asc'): T[] {
    if (!Array.isArray(array)) {
      return array;
    }

    const direction = order && order.toLowerCase() === 'desc' ? -1 : 1;

    return array.sort((a, b) => {
      for (const prop of properties) {
        if (a[prop] < b[prop]) {
          return -1 * direction;
        } else if (a[prop] > b[prop]) {
          return 1 * direction;
        }
      }
      return 0;
    });
  }
}
