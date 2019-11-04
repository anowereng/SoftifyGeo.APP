import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { FormControl } from '@angular/forms';
import { IonInfiniteScroll } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.page.html',
  styleUrls: ['./visit-list.page.scss'],
})

export class VisitListPage implements OnInit {

  today = new Date();

  mydate2 = '';

  // mydate2 = '12 Dec 2018';
  datePickerObj: any = {};

  monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weeksList = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  customerlist: any = []; loading: boolean = false; searchTerm: string = ""; type: any = "old";
  searchChanged: any = ""; searching: any = false;
  searchControl: FormControl; customerFilterList: any = []; numTimesLeft = 5; items = [];
  // datePickerObj: any = {};
  selectedDate;
  constructor(public navCtrl: NavController, public visitService: VisitService,
              public loadingService: LoadingService, public toastService: ToastService, public datepipe: DatePipe,
              public modalCtrl: ModalController, private el: ElementRef) {
              this.searchControl = new FormControl();
  }

  ngOnInit() {

  
    this.mydate2 = this.datepipe.transform(this.today, 'dd-MMM-yyyy');

    
    const disabledDates: Date[] = [
      new Date(1545911005644),
      new Date(),
      new Date(2018, 12, 12), // Months are 0-based, this is August, 10th.
      new Date('Wednesday, December 26, 2018'), // Works with any valid Date formats like long format
      new Date('12-14-2018'), // Short format
    ];

    // EXAMPLE OBJECT
    this.datePickerObj = {
      // inputDate: new Date('12'), // If you want to set month in date-picker
      // inputDate: new Date('2018'), // If you want to set year in date-picker
      // inputDate: new Date('2018-12'), // If you want to set year & month in date-picker
      inputDate: new Date('2018-12-01'), // If you want to set date in date-picker

      // fromDate: new Date('2015-12-20'), // need this in order to have toDate
      // toDate: new Date('2019-12-25'),
      // showTodayButton: false,
      // closeOnSelect: true,
      // disableWeekDays: [],
      // mondayFirst: true,
      // setLabel: 'Select a Date',
       todayLabel: 'Today',
      // closeLabel: 'Close',
      // disabledDates: [],
      titleLabel: 'Select a Date',
      // monthsList: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      // weeksList: ['S', 'S', 'M', 'T', 'W', 'T', 'F'],
      // dateFormat: 'MMMM D, YYYY',
        dateFormat: 'DD-MMM-YYYY',
      // clearButton: false,
      // momentLocale: 'pt-BR',
      // yearInAscending: true,
      // btnCloseSetInReverse: false,
      btnProperties: {
        expand: 'block', // "block" | "full"
        fill: '', // "clear" | "default" | "outline" | "solid"
        size: '', // "default" | "large" | "small"
        disabled: '', // boolean (default false)
        strong: '', // boolean (default false)
        color: ''
        // "primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium", "dark" , and give color in string
      },

      arrowNextPrev: {
        // nextArrowSrc: 'assets/images/arrow_right.svg',
        // prevArrowSrc: 'assets/images/arrow_left.svg'
      }, // This object supports only SVG files.

    };
}

  async openDatePicker() {
    const datePickerModal = await this.modalCtrl.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 
         'objConfig': this.datePickerObj, 
         'selectedDate': this.selectedDate 
      }
    });
    await datePickerModal.present();
 
    datePickerModal.onDidDismiss()
      .then((data) => {
        console.log(data);
        this.selectedDate = data.data.date;
      });
  }


  SearchData(event) {
    console.log(event.detail.value);
    console.log(this.type);
    if (event.detail.value.length > 3 && this.type) {
      this.loading = true;
      this.visitService.getAllVisitCustomer(event.detail.value, this.type).subscribe(
        response => {
          this.customerlist = response; this.loading = false;
        }, error => {
          this.toastService.message(error);
        });
    }
  }




}
