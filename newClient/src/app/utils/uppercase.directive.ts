import { ElementRef, NgModule, Renderer2, Self, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Directive, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Directive({
  selector: '[appUppercase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UppercaseDirective),
      multi: true,
    },
  ],
})
export class UppercaseDirective {
  // @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
  //   const input = event.target as HTMLInputElement;
  //   input.value = input.value.toUpperCase();
  // }
  /** implements ControlValueAccessorInterface */
  _onChange!: (_: any) => void;

  /** implements ControlValueAccessorInterface */
  _touched!: () => void;

  constructor( @Self() private _el: ElementRef, private _renderer: Renderer2) { }

  /** Trata as teclas */
  @HostListener('keyup', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    const keyCode = evt.keyCode;
    const key = evt.key;
    //console.log(evt)
    
    //if (keyCode >= A && keyCode <= Z) {
      const value = this._el.nativeElement.value.toUpperCase();
      this._renderer.setProperty(this._el.nativeElement, 'value', value);
      this._onChange(value);
      evt.preventDefault();
    //}
  }

  //@HostListener('blur', ['$event'])
  @HostListener('blur')
  onBlur() {
    this._touched();
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: any): void {
    this._renderer.setProperty(this._el.nativeElement, 'value', value);
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }
}

@NgModule({
  declarations: [UppercaseDirective],
  exports: [UppercaseDirective],
  imports: [CommonModule],
})
export class DirectiveModule {}