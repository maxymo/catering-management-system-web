import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService, ILoginResult} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, ILoginResult {
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onLogin(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.isLoading = false;
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password, this);
  }

  onFailure(): void {
    this.isLoading = false;
  }
}
