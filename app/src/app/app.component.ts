import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { OptionComponent } from './components/option/option.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, SelectComponent, OptionComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'custom-select-demo';

  colorControl = new FormControl<string | null>(null);

  form = new FormGroup({
    country: new FormControl<string | null>(null)
  });

  onColorChange(value: unknown) {
    console.log('color change', value);
  }
}
