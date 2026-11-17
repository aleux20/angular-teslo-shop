import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const IsAdminGuard: CanMatchFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  if (!isAuthenticated) {
    return router.parseUrl('/auth/login');
  }

  const isAdmin = authService.user()?.roles.includes('admin') ?? false;
  return isAdmin ? true : router.parseUrl('/');
};