import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  registerForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.showError();
      return;
    }

    const { fullName, email, password } = this.registerForm.getRawValue();
    this.isPosting.set(true);

    this.authService.register(fullName, email, password).subscribe({
      next: (isAuthenticated) => {
        this.isPosting.set(false);
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.showError();
      },
      error: () => {
        this.isPosting.set(false);
        this.showError();
      },
    });
  }

  private showError() {
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 3000);
  }
}
