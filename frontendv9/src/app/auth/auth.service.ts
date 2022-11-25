import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    return this.http
      .post<{ message: string }>(BACKEND_URL + '/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };

    return this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + 'login', authData)
      .subscribe((result) => {
        const token = result.token;
        if (token) {
          const expiresIn = result.expiresIn * 1000;
          this.setTimer(expiresIn);
          this.token = token;
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          this.userId = result.userId;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  setTimer(expirationInFuture: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expirationInFuture);
  }

  reloadAuthData() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expireIn =
      new Date(authData.expirationDate).getTime() - now.getTime();
    console.log(expireIn);
    if (expireIn > 0) {
      console.log(`Session will expire in ${expireIn} milliseconds.`);
      this.token = authData.token;
      this.userId = authData.userId;
      this.setTimer(expireIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  clearAuthData() {
    console.log('clearing storage');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration || !userId) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expiration),
      userId,
    };
  }
}
