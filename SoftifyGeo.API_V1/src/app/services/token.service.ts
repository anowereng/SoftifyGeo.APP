import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

// import { Toast} from '@ionic-angular';

@Injectable()
export class ToastService{
    // toast: any;
    constructor(private toastCtrl: ToastController){ }

    message(text: string): void {
         this.toastCtrl.create({
      message: text,
      duration: 2000,
      animated: true,
      showCloseButton: true,
      closeButtonText: "OK",
      cssClass: "my-toast",
      position: "bottom"
    }).then((obj) => {
      obj.present();
    });
    }

    // presentClosableToast(text:string):void{
    //     let toastData = {
    //         message: text,
    //         showCloseButton: true,
    //         closeButtonText: 'X',
    //         position: 'top' 
    //     };

    //      this.showToast(toastData);
    // }

    // private showToast(data:any):void{
    //     this.toast ? this.toast.dismiss() : false;
    //     this.toast = this.toastCtrl.create(data);
    //     this.toast.present();
    // }
}