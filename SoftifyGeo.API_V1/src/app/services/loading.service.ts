import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 8000,
      message:'Please Wait....'
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.isLoading) {
          a.dismiss()//.then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async presentWithMessage(data: string) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: data,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }
  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
}