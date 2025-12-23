import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() appHighlight: string = 'yellow';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight('transparent');
  }

  private highlight(color: string) {
    const element = document.activeElement as HTMLElement;
    if (element) {
      element.style.backgroundColor = color;
    }
  }
}
