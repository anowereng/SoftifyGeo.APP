import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckincheckoutService } from "../checkincheckout/checkincheckout.service";
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-checkincheckout',
  templateUrl: './checkincheckout.page.html',
  styleUrls: ['./checkincheckout.page.scss'],
})
export class CheckincheckoutPage implements OnInit {

  
  isIndeterminate:boolean;
  masterCheck:boolean;
  checkBoxList:any;
  isSpinner: boolean= false;
  // public searchTerm: string = "";
  public items: any;
  jsonData: any;
  
  CheckCustomerId:number;
  // public searchControl: FormControl;

  defaultSelectedRadio = "new";
  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup:any;
  //Get value on ionSelect on IonRadio item
  selectedRadioItem:any='old';

  customerlist: any;
  searchTerm : any="";
  constructor(public navCtrl: NavController, public checkInOutService : CheckincheckoutService,
    private toastService:ToastService, private loadservice:LoadingService) { 
   
    }

    ionViewDidLoad(){
      this.customerlist;
      
    }

  radio_list = [
    {
      name: 'custType',
      value: 'old',
      text: 'OLD',
      checked: true,
    }, {
      name: 'custType',
      value: 'new',
      text: 'NEW',
      checked: false,
    }
    
  ];
 
 
  radioSelect(event) {
    this.selectedRadioItem = event.detail.value;
  }
 ngOnInit() {
  }

  custTypeEvent(checktype) {
      console.log(checktype);
  }
  
  checkEvent(ids, ischeck) {
    console.log(this.customerlist);
   for (var i = 0; i < this.customerlist.length; i++) {
    // if (this.customerlist[i].CustId != ids) {
      this.customerlist[i].isChecked = false;
    // }
    
}


    var findIndex= this.customerlist.findIndex(k=>k.CustId== ids);
   console.log(findIndex);
  this.customerlist[findIndex].isChecked=ischeck

  //  for(var i=0;i<this.customerlist.length;i++){

  //  }
    //  this.customerlist[findIndex.isc].isChecked=true

    // this.customerlist[this.customerlist.findIndex(ids)].isChecked]
  //   const totalItems = this.checkBoxList.length;
  //   let checked = 0;
  //   for (var i = 0; i < this.checkBoxList.length; i++) {
      
  //     if (this.checkBoxList[i].id==ids && ischeck==true) {
  //       this.checkBoxList[i].isChecked=true
  //     }
  //     else{
  //       this.checkBoxList[i].isChecked=false
  //     }
  // }
    // this.CheckCustomerId =  ids;
    console.log("Cstomer Id : "+ids);
    console.log("ischeck : "+ischeck);
  }

  SearchData() {
    if (this.searchTerm.length>3) {
    this.isSpinner =true;
    this.checkInOutService.SearchData(this.searchTerm).subscribe(
    response => {
      this.customerlist = response;
      // this.customerlist[0].isChecked= this.customerlist[0].isChecked.toLowerCase() == 'true' ? true : false;
      for(var i=0; i<this.customerlist; i++){
        this.customerlist[i].isChecked = this.customerlist[i].isChecked.toLowerCase() == 'true' ? true : false;
      }
      // console.log(this.customerlist[0]);

      this.isSpinner =false;

    },error => {
      this.toastService.message(error);
      this.isSpinner =false;
    });
  }
}

}


  


