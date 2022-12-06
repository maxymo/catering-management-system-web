import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService, ILoginResult} from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, ILoginResult {
  isLoading = false;
  public loginForm = new FormGroup({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {}

  onLogin() {
    this.isLoading = true;
    if (this.loginForm.invalid) {
      this.isLoading = false;
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if (email != null && password != null) {
      this.authService.login(email, password, this)
        .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          error: () => {
            this.isLoading = false;
          }
        })
    }
  }

  onFailure(): void {
    this.isLoading = false;
  }
}
