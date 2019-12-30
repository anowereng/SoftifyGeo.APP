
import { Injectable } from '@angular/core';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
@Injectable()

export class DatePickerService {

    datePickerObj: any = {};
    // selectedDate: string;
    today = new Date();

    constructor(public modalCtrl: ModalController, public datepipe: DatePipe) {
        // this.selectedDate = this.datepipe.transform(this.today, 'dd-MMM-yyyy');
        this.selectedDate();
    }
    public selectedDate(): any {
        return this.datepipe.transform(this.today, 'dd-MMM-yyyy');
    }

    public GetDatePickerObj(): any {
        // this.selectedDate = this.datepipe.transform(this.today, 'dd-MMM-yyyy');
        // EXAMPLE OBJECT
        return {
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
            clearButton: true,
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

}




