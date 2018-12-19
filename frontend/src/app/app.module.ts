import { Proxy } from './../helpers/proxy/proxy';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { FileComponent } from './file/file/file.component';
import { CommentComponent } from './post/comment/comment/comment.component';

import { HomePageModule } from './pages/home/home.module';
import { RegisterPageModule } from './pages/user/register/register.module';
import { LoginPageModule } from './pages/user/login/login.module';

@NgModule({
  declarations: [
    AppComponent,
    CommentComponent,
    FileComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HomePageModule,
    RegisterPageModule,
    LoginPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Proxy,
    HttpClient,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
