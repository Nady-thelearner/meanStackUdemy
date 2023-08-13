import { Component, OnInit } from '@angular/core';
import { authService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'meanApp';
constructor(private authSF : authService){}

ngOnInit(): void {
this.authSF.autoLogin()
}
}


//"64d337f2a974525b134db796"
//"64d337f2a974525b134db796"
//"64d4ca7b6e71340e88c9e823"
//"64d4ca7b6e71340e88c9e823"
