import { Proxy } from './../../../../helpers/proxy/proxy';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { HomePage } from '../../home/home.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public username = '';
  public password = '';
  protected isLogged: Boolean;
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
  async  loginAction(e) {
    const loader = await this.loadingCtrl.create({
      message: "Entrando",
      spinner: 'crescent',
      duration: 3000
    });

    loader.present();

    var params = {
      email: this.username,
      password: this.password
    };

    this.proxy.user.login(params)
      .then((result: { status: boolean, content: any }) => {
        loader.dismiss();

        if (result.status) {
          localStorage.setItem('user', JSON.stringify(result.content));
          localStorage.setItem('token', result.content.token);

          this.isLogged = true;
          this.navCtrl.navigateForward('home');
        } else {
          this.toastCtrl.create({
            message: result.content,
            duration: 3000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "Cerrar",
            cssClass: 'message error-message'
          }).present();
        }
      }).catch(console.log);
  }
}
