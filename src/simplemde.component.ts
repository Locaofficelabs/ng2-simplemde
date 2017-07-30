import {
  Component,
  NgModule,
  forwardRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnDestroy,
  ModuleWithProviders,
  Inject,
  ViewEncapsulation
} from '@angular/core'
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgModelBase } from './utils'
import { SIMPLEMDE_CONFIG } from './config'
import * as SimpleMDE from 'simplemde'

const SIMPLEMDE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Simplemde),
  multi: true
}

@Component({
  selector: 'simplemde',
  encapsulation: ViewEncapsulation.None,
  template: `
    <textarea #simplemde></textarea>
  `,
  providers: [
    SIMPLEMDE_CONTROL_VALUE_ACCESSOR
  ],
  styleUrls: ['../node_modules/simplemde/dist/simplemde.min.css']
})
export class Simplemde extends NgModelBase implements AfterViewInit, ControlValueAccessor, OnDestroy {
  _onTouched: any;
  _onChange: any;

  @ViewChild('simplemde') textarea: ElementRef
  @Input() options: SimpleMDE.Options = {}

  private simplemde: SimpleMDE

  writeValue(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v
      if (this.value != null) {
        if (this.simplemde) {
          this.simplemde.value(this.value)
        }
      }
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  //get accessor
  get value(): any { return this._innerValue; };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v;
      this._onChange(v);
    }
  }

  ngAfterViewInit() {
    if (typeof this.config !== 'object' || typeof this.options !== 'object') {
      throw 'config is not an object'
    }

    const config = { ...this.config, ...this.options }
    config.element = this.textarea.nativeElement

    this.simplemde = new SimpleMDE(config)

    this.simplemde.codemirror.on('change', () => {
      this.value = this.simplemde.value()
      this._onChange(this.value)
    })
  }

  ngOnDestroy() {
    this.simplemde = null
  }

  constructor(
    @Inject(SIMPLEMDE_CONFIG) private config
  ) {
    super()
  }

}

@NgModule({
  declarations: [
    Simplemde
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    Simplemde,
    FormsModule,
    CommonModule
  ]
})
export class SimplemdeModule {
  static forRoot(configProvider: any = {
    provide: SIMPLEMDE_CONFIG,
    useValue: {}
  }): ModuleWithProviders {
    return {
      ngModule: SimplemdeModule,
      providers: [
        configProvider
      ]
    }
  }
}
