import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'simplemde-app',
  encapsulation: ViewEncapsulation.None,
  template: require('./app.html')
})
export class AppComponent implements OnInit {

  value = '11111'
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() { 
    this.form = this.fb.group({
      'description': new FormControl('', Validators.required)
    });
  }
}
