import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { finalize } from 'rxjs/operators';
import { stringify } from 'querystring';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userinfo: any; IsPasswordChange: boolean = false; isTextFieldType: boolean;
  constructor(public authService: AuthService, public router: Router,
              public toastService: ToastService, public UserService: UserService) { }

  public user: any = {
    OldPassword: '',
    NewPassword: '',
    FuelAmount: 0,
    isTextFieldType: false
  };

  ngOnInit() {
    this.userinfo = this.authService.getUserInfo();
  }
  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }
  PasswordChange() {
    this.IsPasswordChange = true;
  }

  ResetForm() {
    this.togglePasswordFieldType();
    this.user = {};
    this.isTextFieldType = false;
    this.IsPasswordChange = false;
  }


  UpdatePassword() {
    if (navigator.onLine) {
      if (this.Vaildation()) {
        this.UserService.UpdateProfile(this.user).pipe(finalize(() => {
        })).subscribe(
          () => {
            this.toastService.message('Update Successfully');
            this.ResetForm();
          }, error => {
            console.log(error);
            this.toastService.message(error);
          });
      }
    } else {
      this.toastService.showLoader('please check internet connection !!');
    }
  }


  Vaildation() {
    var flag = true;
    if (this.user.NewPassword === '' || this.user.OldPassword === '') {
      flag = false;
      this.toastService.message(' input field are empty !! ');
    } else if (this.userinfo.family_name !== this.user.OldPassword) {
      flag = false;
      this.toastService.message(' old password are wrong !! ');
    }
    return flag;
  }
  CancelUpdate() {
    this.ResetForm();
  }
}



  //   setFilteredItems() {
  //     this.jsonData = this.data.filterItems(this.searchTerm);
  // }


