import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController){}
  onSignIn(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Signing In..'
    });
    loading.present();
    this.authService.signIn(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Sign In Failed',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
