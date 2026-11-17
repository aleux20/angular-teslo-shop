import { AuthService } from '@/auth/services/auth.service';
import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type Theme = 'light' | 'dark' | 'night';

@Component({
  selector: 'app-front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  private document = inject(DOCUMENT);
  private readonly availableThemes: Theme[] = ['light', 'dark', 'night'];

  theme = signal<Theme>(this.getInitialTheme());

  authService = inject(AuthService);

  constructor() {
    this.applyTheme(this.theme());
  }

  onThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;

    const selectedTheme = target.value;
    if (!this.isTheme(selectedTheme)) return;

    this.theme.set(selectedTheme);
    this.applyTheme(selectedTheme);
    this.document.defaultView?.localStorage.setItem('teslo-shop-theme', selectedTheme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = this.document.defaultView?.localStorage.getItem('teslo-shop-theme');
    if (this.isTheme(savedTheme)) return savedTheme;

    const currentTheme = this.document.documentElement.getAttribute('data-theme');
    return this.isTheme(currentTheme) ? currentTheme : 'night';
  }

  private isTheme(theme: string | null | undefined): theme is Theme {
    return !!theme && this.availableThemes.includes(theme as Theme);
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
