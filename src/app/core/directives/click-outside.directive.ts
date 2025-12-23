import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const element = document.querySelector('[appClickOutside]') as HTMLElement;

    if (element && !element.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
