import { Component, OnDestroy, OnInit } from '@angular/core';
import { authService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubListener: Subscription;
  isAuthenticated = false;
  constructor(private authSF: authService) {}

  ngOnInit() {
    this.isAuthenticated = this.authSF.getisAuthenticated();
    this.authSubListener = this.authSF
      .getAuthStatusListener()
      .subscribe((isAuth) => (this.isAuthenticated = isAuth));
  }

  onlogout() {
    this.authSF.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubListener) {
      this.authSubListener.unsubscribe();
    }
  }
}
