import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
// import { RecaptchaValueAccessorDirective } from './recaptcha-value-accessor';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { UserFormComponent } from './user-form/user-form.component';
import { SuccessComponent } from './success/success.component';
import {AppComponent} from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';


@NgModule({
  declarations: [
    // RecaptchaValueAccessorDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // RecaptchaModule,
    // RecaptchaFormsModule,
    // RecaptchaV3Module,
    RouterModule.forRoot(routes)
  ],
  providers: [    ],
})
// provide: RECAPTCHA_V3_SITE_KEY,
//       useValue: environment.recaptcha.siteKey,
export class AppModule {
  // (provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.RECAPTCHA_KEY )
 }
