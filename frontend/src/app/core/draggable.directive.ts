import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective {
  @Input() handle: HTMLElement | undefined;

  private isDragging = false;
  private initialX = 0;
  private initialY = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.handle && !this.handle.contains(event.target as Node)) {
      return;
    }

    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    const style = window.getComputedStyle(this.el.nativeElement);
    const matrix = new DOMMatrix(style.transform);
    this.initialX = matrix.m41;
    this.initialY = matrix.m42;

    this.renderer.addClass(this.el.nativeElement, 'dragging');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      const newX = this.initialX + deltaX;
      const newY = this.initialY + deltaY;
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${newX}px, ${newY}px, 0)`);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
    this.renderer.removeClass(this.el.nativeElement, 'dragging');
  }
}
