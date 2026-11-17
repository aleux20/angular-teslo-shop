import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  private router = inject(Router);

  title = signal(this.getTitle(this.router.url));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.title.set(this.getTitle(event.urlAfterRedirects)));
  }

  private getTitle(url: string): string {
    const path = url.split(/[?#]/, 1)[0];
    return path.endsWith('/register') ? 'Crear cuenta' : 'Iniciar sesión';
  }
}
