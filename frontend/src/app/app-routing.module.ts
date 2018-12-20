import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/user/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/user/register/register.module#RegisterPageModule' },
  { path: 'postForm', loadChildren: './post/post-form/post-form.module#PostFormPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
