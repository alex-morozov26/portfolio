import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output, QueryList, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, OptionComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="select" (click)="toggleOpen()" #trigger>
      <span class="selected-label">{{ selectedLabel || placeholder }}</span>
      <span class="arrow" [class.open]="opened">▾</span>
    </div>

    <div class="panel" *ngIf="opened" (click)="$event.stopPropagation()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
    :host { position: relative; display: inline-block; min-width: 200px; }
    .select { display: flex; align-items: center; justify-content: space-between; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; cursor: pointer; background: white; }
    .select:focus { outline: 2px solid #3b82f6; }
    .selected-label { color: #111827; }
    .arrow { margin-left: 8px; transition: transform .15s ease; }
    .arrow.open { transform: rotate(180deg); }
    .panel { position: absolute; z-index: 10; left: 0; right: 0; margin-top: 4px; background: white; border: 1px solid #d1d5db; border-radius: 6px; max-height: 240px; overflow: auto; box-shadow: 0 4px 12px rgba(0,0,0,.08); }
    `
  ]
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit {
  @Input() placeholder = 'Select option';
  @Input() disabled = false;

  @Output() readonly change = new EventEmitter<unknown>();

  @HostBinding('class.disabled') get isDisabledCls() { return this.disabled; }

  @ViewChild('trigger', { static: true }) triggerRef!: ElementRef<HTMLDivElement>;
  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>;

  opened = false;
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  private _value: unknown;
  selectedLabel: string = '';

  ngAfterContentInit(): void {
    this.bindOptions();
    // Reflect initial value to selection if provided before content init.
    this.updateSelectionByValue(this._value);
  }

  private bindOptions(): void {
    this.options.forEach((option) => {
      option.select.subscribe((selected) => {
        this.selectOption(selected);
      });
    });

    this.options.changes.subscribe(() => {
      this.bindOptions();
      this.updateSelectionByValue(this._value);
    });
  }

  writeValue(value: unknown): void {
    this._value = value;
    this.updateSelectionByValue(value);
  }

  registerOnChange(fn: (value: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  toggleOpen(): void {
    if (this.disabled) return;
    this.opened = !this.opened;
    if (!this.opened) {
      this.onTouched();
    }
  }

  private selectOption(option: OptionComponent): void {
    if (option.disabled) return;

    this._value = option.value ?? option.getLabel();
    this.selectedLabel = option.getLabel();
    this.onChange(this._value);
    this.change.emit(this._value);

    this.options.forEach((opt) => (opt.selected = opt === option));
    this.opened = false;
    this.onTouched();
  }

  private updateSelectionByValue(value: unknown): void {
    if (!this.options) return;

    let matched: OptionComponent | undefined;
    this.options.forEach((opt) => {
      const isMatch = (opt.value ?? opt.getLabel()) === value;
      opt.selected = isMatch;
      if (isMatch) matched = opt;
    });
    if (matched) {
      this.selectedLabel = matched.getLabel();
    } else {
      this.selectedLabel = '';
    }
  }
}