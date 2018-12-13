import { UserProxy } from './../helpers/proxy/user.proxy';
import { Proxy } from './../helpers/proxy/proxy';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './user/register/register.component';
import { PostComponent } from './post/post/post.component';
import { LikeComponent } from './like/like/like.component';
import { CommentComponent } from './comment/comment/comment.component';
import { FileComponent } from './file/file/file.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    PostComponent,
    LikeComponent,
    CommentComponent,
    FileComponent],

  entryComponents: [],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Proxy,
    HttpClient,
    UserProxy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
