import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services';
import { User } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <!-- Brand -->
        <a routerLink="/" class="brand">
          <span class="brand-icon">&#127910;</span>
          <span class="brand-name">Cinema Palace</span>
        </a>

        <!-- Nav links -->
        <div class="nav-links">
          <a routerLink="/" class="nav-link">Movies</a>
        </div>

        <!-- Auth section -->
        <div class="nav-auth">
          <!-- Not logged in -->
          <ng-container *ngIf="!currentUser()">
            <a routerLink="/login" class="btn-ghost">Sign In</a>
            <a routerLink="/register" class="btn-filled">Register</a>
          </ng-container>

          <!-- Logged in -->
          <ng-container *ngIf="currentUser()">
            <div class="user-menu" (click)="toggleDropdown()">
              <div class="avatar">{{ currentUser()!.avatar }}</div>
              <span class="user-name">{{ firstName() }}</span>
              <span class="chevron" [class.open]="dropdownOpen()">&#8964;</span>
            </div>

            <div class="dropdown" *ngIf="dropdownOpen()">
              <div class="dropdown-header">
                <div class="avatar lg">{{ currentUser()!.avatar }}</div>
                <div>
                  <div class="d-name">{{ currentUser()!.fullName }}</div>
                  <div class="d-email">{{ currentUser()!.email }}</div>
                </div>
              </div>
              <hr class="d-divider">
              <button class="d-item logout" (click)="logout()">
                <span>&#9747;</span> Sign Out
              </button>
            </div>
          </ng-container>
        </div>
      </div>
    </nav>

    <!-- Backdrop to close dropdown -->
    <div class="backdrop" *ngIf="dropdownOpen()" (click)="dropdownOpen.set(false)"></div>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0a0a0a;
      border-bottom: 2px solid #2d0a0a;
      box-shadow: 0 2px 20px rgba(225,29,72,0.15);
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }

    .brand-icon { font-size: 26px; }

    .brand-name {
      font-size: 18px;
      font-weight: 800;
      background: linear-gradient(135deg, #e11d48, #f87171);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 6px;
      flex: 1;
    }

    .nav-link {
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      transition: color 0.2s, background 0.2s;
    }

    .nav-link:hover {
      color: #fff;
      background: rgba(225,29,72,0.12);
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      position: relative;
    }

    .btn-ghost {
      color: #f43f5e;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 10px;
      border: 1.5px solid #7f1d1d;
      transition: all 0.2s;
    }

    .btn-ghost:hover {
      background: rgba(225,29,72,0.1);
      border-color: #e11d48;
      color: #fff;
    }

    .btn-filled {
      color: #fff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 18px;
      border-radius: 10px;
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      transition: opacity 0.2s, transform 0.15s;
    }

    .btn-filled:hover { opacity: 0.9; transform: translateY(-1px); }

    /* User menu */
    .user-menu {
      display: flex;
      align-items: center;
      gap: 9px;
      cursor: pointer;
      padding: 6px 12px 6px 6px;
      border-radius: 12px;
      border: 1.5px solid #2d0a0a;
      transition: background 0.2s, border-color 0.2s;
      user-select: none;
    }

    .user-menu:hover {
      background: rgba(225,29,72,0.08);
      border-color: #7f1d1d;
    }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e11d48, #f43f5e);
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar.lg {
      width: 42px;
      height: 42px;
      font-size: 15px;
    }

    .user-name {
      color: rgba(255,255,255,0.85);
      font-size: 14px;
      font-weight: 600;
    }

    .chevron {
      color: rgba(255,255,255,0.35);
      font-size: 16px;
      transition: transform 0.25s;
      display: inline-block;
    }

    .chevron.open { transform: rotate(180deg); }

    /* Dropdown */
    .dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: #111111;
      border: 1.5px solid #2d0a0a;
      border-radius: 16px;
      padding: 16px;
      min-width: 240px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      animation: dropIn 0.2s ease-out;
      z-index: 1001;
    }

    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .d-name {
      color: #fff;
      font-weight: 700;
      font-size: 14px;
    }

    .d-email {
      color: rgba(255,255,255,0.4);
      font-size: 12px;
      margin-top: 2px;
      word-break: break-all;
    }

    .d-divider {
      border: none;
      border-top: 1px solid #2d0a0a;
      margin: 14px 0;
    }

    .d-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.55);
      font-size: 14px;
      padding: 10px 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      text-align: left;
    }

    .d-item:hover { background: rgba(225,29,72,0.1); color: #f43f5e; }

    .d-item.logout:hover { background: rgba(225,29,72,0.15); color: #ff6b6b; }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 999;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser = signal<User | null>(null);
  dropdownOpen = signal(false);
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => this.currentUser.set(state.user));
  }

  firstName(): string {
    const name = this.currentUser()?.fullName || '';
    return name.split(' ')[0];
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  logout() {
    this.dropdownOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
