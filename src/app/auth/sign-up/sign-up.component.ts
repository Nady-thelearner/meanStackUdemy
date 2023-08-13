import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit , OnDestroy {
  isLoading = false;
  message : string
  authSubs : Subscription;
  constructor(private authService : authService){}


  ngOnInit(): void {
    this.authSubs= this.authService.getAuthStatusListener().subscribe({
      next : (isAuth)=>{
        console.log("sign up component ", isAuth)
        if(!isAuth){
          this.isLoading = false;
         }
        },
      error : (error) =>{
        console.log("signup message error" , error);
        this.isLoading = false;
      }


    })
  }
  ngOnDestroy(): void {
    if(this.authSubs){
      this.authSubs.unsubscribe();
    }
  }


  onSignup(form : NgForm){

    if (form.invalid) {
      return;
    }
    console.log("signup started")
    this.authService.createUser(form.value.email , form.value.password);
    this.isLoading = true;
  }
}
