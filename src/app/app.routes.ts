import { Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { SuccessComponent } from './success/success.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/user-form', pathMatch: 'full' },
  { path: 'user-form', component: UserFormComponent },
  { path: 'success', component: SuccessComponent },
  // { path: 'admin', component: AdminComponent }
  { path: '', redirectTo: '/user-form', pathMatch: 'full' },
  { path: '**', redirectTo: '/user-form' },
];
