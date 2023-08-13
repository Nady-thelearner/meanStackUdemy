import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class authService {
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private route: Router) {}

  getToken() {
    return this.token;
  }

  getisAuthenticated() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    console.log('signupp service triggerd');
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe({
        next: (res) => {
          this.route.navigate(['/']);
        },
        error: (error) => {
          this.authStatusListener.next(false);
        },
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe({
        next: (res) => {
          this.token = res.token;
          if (this.token) {
            const expiresInDuration = res.expiresIn;
            this.userId = res.userId;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log('expration Date', expirationDate);
            this.saveAuthData(this.token, expirationDate, this.userId);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.route.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error creating user:', error.message);
          this.authStatusListener.next(false);
        },
      });
  }

  autoLogin() {
    const authInfo = this.getAuth();
    if (!authInfo) {
      return;
    }
    if (authInfo.token && authInfo.expirationDate > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(authInfo.expirationDate / 1000);
      this.authStatusListener.next(true);
      this.route.navigate(['/']);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.route.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token),
      localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuth() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    const now = new Date();
    const expDate = new Date(expirationDate);
    if (!token || expDate < now) {
      return null;
    }
    return {
      token: token,
      expirationDate: expDate.getTime() - now.getTime(),
      userId: userId,
    };
  }
}
