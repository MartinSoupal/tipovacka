import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe implements PipeTransform {

  transform(array: any[], property: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    const direction = order && order.toLowerCase() === 'desc' ? -1 : 1;

    return array.sort((a: any, b: any) => {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }
}
