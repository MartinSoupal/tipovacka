import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe implements PipeTransform {

  transform(array: any[], properties: string[], order: 'asc' | 'desc' = 'asc'): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    const direction = order && order.toLowerCase() === 'desc' ? -1 : 1;

    return array.sort((a: any, b: any) => {
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
