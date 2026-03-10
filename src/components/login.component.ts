import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">

        <div class="auth-header">
          <div class="logo">🎬</div>
          <h1>Welcome Back</h1>
          <p>Sign in to book your favourite movies</p>
        </div>

        <!-- Demo credentials hint -->
        <div class="demo-hint">
          <span class="demo-label">Demo Account</span>
          <span>demo&#64;cinema.com &nbsp;/&nbsp; Demo&#64;1234</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">&#9993;</span>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                [class.input-error]="isInvalid('email')">
            </div>
            <span class="error-msg" *ngIf="isInvalid('email')">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Enter a valid email</span>
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">&#128274;</span>
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Your password"
                [class.input-error]="isInvalid('password')">
              <button type="button" class="toggle-pw" (click)="showPassword.set(!showPassword())">
                {{ showPassword() ? 'Hide' : 'Show' }}
              </button>
            </div>
            <span class="error-msg" *ngIf="isInvalid('password')">Password is required</span>
          </div>

          <!-- Server error -->
          <div class="server-error" *ngIf="serverError()">
            &#9888; {{ serverError() }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Sign In</span>
            <span *ngIf="isLoading()" class="spinner">&#9696;</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
          <a routerLink="/" class="back-home">&#8592; Back to Movies</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(160deg, #0a0a0a 0%, #150505 60%, #0f0505 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-card {
      background: #111111;
      border: 1.5px solid #2d0a0a;
      border-radius: 24px;
      padding: 48px 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 16px 60px rgba(225,29,72,0.15);
      animation: fadeSlideUp 0.5s ease-out;
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .logo {
      font-size: 52px;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 16px rgba(102,126,234,0.7));
    }

    .auth-header h1 {
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .auth-header p {
      color: rgba(255,255,255,0.45);
      margin: 0;
      font-size: 14px;
    }

    .demo-hint {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(225,29,72,0.08);
      border: 1px solid #7f1d1d;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 28px;
      color: #f87171;
      font-size: 13px;
      flex-wrap: wrap;
    }

    .demo-label {
      background: #e11d48;
      color: #fff;
      padding: 3px 8px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }

    .form-group {
      margin-bottom: 22px;
    }

    label {
      display: block;
      color: rgba(255,255,255,0.65);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.4px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: rgba(255,255,255,0.3);
      font-size: 15px;
      pointer-events: none;
    }

    input {
      width: 100%;
      background: #1a1a1a;
      border: 1.5px solid #2d0a0a;
      border-radius: 12px;
      padding: 13px 48px 13px 42px;
      color: #fff;
      font-size: 14px;
      transition: border-color 0.25s, box-shadow 0.25s;
      outline: none;
    }

    input::placeholder { color: rgba(255,255,255,0.2); }

    input:focus {
      border-color: #e11d48;
      box-shadow: 0 0 0 3px rgba(225,29,72,0.15);
    }

    .input-error {
      border-color: #f44336 !important;
      box-shadow: 0 0 0 3px rgba(244,67,54,0.15) !important;
    }

    .toggle-pw {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.3);
      font-size: 12px;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 4px;
      transition: color 0.2s;
    }

    .toggle-pw:hover { color: #e11d48; }

    .error-msg {
      display: block;
      color: #ff6b6b;
      font-size: 12px;
      margin-top: 6px;
    }

    .server-error {
      background: rgba(244,67,54,0.12);
      border: 1px solid rgba(244,67,54,0.35);
      border-radius: 10px;
      padding: 12px 16px;
      color: #ff6b6b;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.25s, transform 0.15s;
      letter-spacing: 0.5px;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner {
      display: inline-block;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 28px;
    }

    .auth-footer p {
      color: rgba(255,255,255,0.4);
      font-size: 14px;
      margin: 0 0 12px;
    }

    .auth-footer a {
      color: #f43f5e;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .auth-footer a:hover { color: #fff; }

    .back-home {
      display: block;
      color: rgba(255,255,255,0.25) !important;
      font-size: 13px;
      font-weight: 400 !important;
      margin-top: 8px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = signal(false);
  serverError = signal('');
  showPassword = signal(false);
  private returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
      return;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.serverError.set('');
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.serverError.set(err.message);
      }
    });
  }
}
