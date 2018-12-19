import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Proxy } from 'src/helpers/proxy/proxy';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})

export class RegisterPage implements OnInit {
  isLogged: boolean;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private proxy: Proxy
  ) {
    this.isLogged = false;
  }

  ngOnInit() {
  }

  async registerAction(event) {
    console.log('event: ', event);
    const params = {
      firstName: event.target[0].value,
      lastName: event.target[1].value,
      birthday: `${event.target[2].value} 12:00:00`,
      email: event.target[3].value,
      password: event.target[4].value
    };
    
    const loader = await this.loadingCtrl.create({
      message: "Registrando",
      duration: 3000
    });

    loader.present();

    this.proxy.user.save(null, params)
      .then((result: { status: boolean, content: any }) => {
        loader.dismiss();

        if (result.status) {
          this.navCtrl.navigateForward('login');
        } else {
          this.toastCtrl.create({
            message: result.content,
            duration: 3000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "Cerrar",
            cssClass: 'message error-message'
          }).then(toast => {
            toast.present();
          });
        }
      }).catch(console.log);
  }
}
