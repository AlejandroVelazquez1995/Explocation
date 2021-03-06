import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalQuestionPageModule } from './pages/modal-question/modal-question.module';
// import { AlertRightAnswerComponent } from '../app/components/alert-right-answer/alert-right-answer.component';
import { IonicStorageModule } from '@ionic/storage';
import { InfoImagePageModule } from './pages/info-image/info-image.module';
import { InfoAppPageModule } from './pages/info-app/info-app.module';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ModalQuestionPageModule,
    InfoImagePageModule,
    InfoAppPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
