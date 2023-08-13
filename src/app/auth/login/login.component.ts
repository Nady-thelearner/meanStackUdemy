
import { Component, OnDestroy, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { authService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy {
  loginSubs : Subscription;
constructor( private authService : authService){}

  isLoading = false;

  ngOnInit(): void {
    this.loginSubs = this.authService.getAuthStatusListener().subscribe({
      next : (isAuth)=>{
        if(!isAuth){
          this.isLoading = false;
        }
      },
      error : (error)=>{
        console.log("error",error);
        this.isLoading = false;
      }
    })
  }

  onLogin(form : NgForm){

    if (form.invalid) {
      return;
    }
    console.log("form ",form)
    this.isLoading = true
    this.authService.loginUser(form.value.email , form.value.password)

  }

  ngOnDestroy(): void {
      if(this.loginSubs){
        this.loginSubs.unsubscribe();
      }
  }
}
