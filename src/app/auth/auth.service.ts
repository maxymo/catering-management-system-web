import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {catchError, map} from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + 'user/';
const MILLISECONDS = 1000;
export interface ILoginResult {
  onFailure() : void;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token!: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId!: string;

  constructor(private http: HttpClient, private router: Router) { }

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

  login(email: string, password: string, callback: ILoginResult) {
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
      .pipe(
        map((result: { token: string; expiresIn: number; userId: string; }) => {
        const token = result.token;
        const expiresIn = result.expiresIn * MILLISECONDS;
        this.setTimer(expiresIn);
        this.token = token;
        this.authStatusListener.next(true);
        this.isAuthenticated = true;
        this.userId = result.userId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * MILLISECONDS);
        this.saveAuthData(token, expirationDate, this.userId);
        return result;
      }))
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = '';
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
      const expireInSeconds = expireIn / MILLISECONDS;
      console.log(`Session will expire in ${expireInSeconds} seconds.`);
      this.token = authData.token;
      this.userId = authData.userId;
      this.setTimer(expireInSeconds);
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
