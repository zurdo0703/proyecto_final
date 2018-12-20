import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    // private toastCtrl: ToastController,
    // private proxy: Proxy
  ) { }
  postAction() {
    this.navCtrl.navigateForward('postForm');
  }
  
  async createPost(event) {
    console.log(event);
    const params = {
      // file: event.file[0].value,
      comment: event.target[1].value
      
    };

    // const loader = await this.loadingCtrl.create({
    //   message: "Creando Post",
    //   duration: 3000
    // });
    // loader.present();

    // this.proxy.user.save(null, params)
    //   .then((result: { status: boolean, content: any }) => {
    //     loader.dismiss();

  }

}

