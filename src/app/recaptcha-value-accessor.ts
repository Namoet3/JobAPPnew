// import { Directive, forwardRef } from '@angular/core';
// import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// @Directive({
//   selector: 're-captcha',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => RecaptchaValueAccessorDirective),
//       multi: true,
//     },
//   ],
// })
// export class RecaptchaValueAccessorDirective implements ControlValueAccessor {
//   onChange = (_: any) => {};
//   onTouched = () => {};

//   writeValue(value: any): void {
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState?(isDisabled: boolean): void {
//   }
// }
