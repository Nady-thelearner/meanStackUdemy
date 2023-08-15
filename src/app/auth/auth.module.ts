import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations :[LoginComponent,SignUpComponent],
  imports : [AngularMaterialModule,CommonModule,FormsModule]
})
export class AuthModule{}



