import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  loginForm: FormGroup;
 
  constructor(private formBuilder: FormBuilder, private authService: AuthService,
     private message:ToastService, private router: Router) { }
 
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      UserName: ['', [Validators.required]],
      UserPass: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
 
  onSubmit() {
    console.log(navigator.onLine);
    // this.loadservice.present()
   if (navigator.onLine)
    this.authService.login(this.loginForm.value).subscribe();
    else
       this.message.message("Please check internet connection...")
      //  this.loadservice.dismiss();
  }
 

 
}