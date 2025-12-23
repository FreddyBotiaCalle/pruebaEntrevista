import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string | undefined, format: string = 'short'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;

    switch (format) {
      case 'short':
        return date.toLocaleDateString('es-ES');
      case 'long':
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'time':
        return date.toLocaleTimeString('es-ES');
      case 'full':
        return date.toLocaleString('es-ES');
      default:
        return date.toLocaleDateString('es-ES');
    }
  }
}
