import { Component, EventEmitter, HostBinding, Input, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'app-option',
  standalone: true,
  template: `
    <div class="option" [class.disabled]="disabled" (click)="onClick($event)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
    :host { display: block; }
    .option { padding: 8px 12px; cursor: pointer; }
    .option:hover { background: #f3f4f6; }
    .option.disabled { color: #9ca3af; cursor: not-allowed; }
    :host(.selected) .option { background: #e5e7eb; }
    `
  ]
})
export class OptionComponent {
  @Input() value: unknown;
  @Input() disabled = false;

  @HostBinding('class.selected') selected = false;

  @Output() readonly select = new EventEmitter<OptionComponent>();

  constructor(private readonly hostRef: ElementRef<HTMLElement>) {}

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.select.emit(this);
  }

  getLabel(): string {
    const text = this.hostRef.nativeElement.textContent ?? '';
    return text.trim();
  }
}