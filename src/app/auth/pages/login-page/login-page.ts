import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.triggerError();
      return;
    }

    this.isPosting.set(true);
    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (isAuthenticated) => {
        this.isPosting.set(false);
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.triggerError();
      },
      error: () => {
        this.isPosting.set(false);
        this.triggerError();
      },
    });
  }

  private triggerError() {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, 3000);
  }
}
