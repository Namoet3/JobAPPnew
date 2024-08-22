import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY, RecaptchaModule } from 'ng-recaptcha';
import { RouterModule, Routes } from '@angular/router';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom, ApplicationConfig } from '@angular/core';


import { UserFormComponent } from './user-form/user-form.component';
import { SuccessComponent } from './success/success.component';
import { AdminComponent } from './admin/admin.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    UserFormComponent,
    // RecaptchaModule,
    RouterModule,
    SuccessComponent,
    AdminComponent,

  ],
  providers: [
    // ReCaptchaV3Service,
    // { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LfnkhYqAAAAALkenoU4-hfH6E3kP6TCaOzxNxgN' },
  ]
})
export class AppComponent {
  title = 'Job Application';

  // constructor(private recaptchaV3Service: ReCaptchaV3Service) { }

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    // this.recaptchaV3Service.execute('importantAction')
    //   .subscribe((token: string) => {
    //     console.debug(`Token [${token}] generated`);
    //   });
  }
}
