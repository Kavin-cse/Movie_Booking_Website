import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services';

/* Custom validators */
function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const val: string = control.value || '';
  if (!val) return null;
  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasDigit = /\d/.test(val);
  const hasSpecial = /[^A-Za-z0-9]/.test(val);
  return hasUpper && hasLower && hasDigit && hasSpecial ? null : { weakPassword: true };
}

function mustMatch(a: string, b: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const ctrlA = group.get(a);
    const ctrlB = group.get(b);
    if (!ctrlA || !ctrlB) return null;
    return ctrlA.value === ctrlB.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">

        <div class="auth-header">
          <div class="logo">🎬</div>
          <h1>Create Account</h1>
          <p>Join Cinema Palace and start booking</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>

          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input id="fullName" type="text" formControlName="fullName"
                placeholder="John Doe"
                [class.input-error]="isInvalid('fullName')">
              <span class="error-msg" *ngIf="isInvalid('fullName')">
                <span *ngIf="registerForm.get('fullName')?.errors?.['required']">Name is required</span>
                <span *ngIf="registerForm.get('fullName')?.errors?.['minlength']">At least 3 characters</span>
              </span>
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input id="phone" type="tel" formControlName="phone"
                placeholder="98765 43210"
                [class.input-error]="isInvalid('phone')">
              <span class="error-msg" *ngIf="isInvalid('phone')">Valid 10-digit phone required</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" formControlName="email"
              placeholder="you@example.com"
              [class.input-error]="isInvalid('email')">
            <span class="error-msg" *ngIf="isInvalid('email')">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Enter a valid email</span>
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input id="password"
                  [type]="showPw() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Min 8 chars"
                  [class.input-error]="isInvalid('password')">
                <button type="button" class="toggle-pw" (click)="showPw.set(!showPw())">
                  {{ showPw() ? 'Hide' : 'Show' }}
                </button>
              </div>
              <span class="error-msg" *ngIf="isInvalid('password')">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Password required</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">At least 8 characters</span>
                <span *ngIf="registerForm.get('password')?.errors?.['weakPassword']">
                  Must include uppercase, lowercase, digit &amp; special char
                </span>
              </span>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input id="confirmPassword"
                [type]="showPw() ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Repeat password"
                [class.input-error]="isInvalid('confirmPassword') || registerForm.errors?.['mismatch']">
              <span class="error-msg" *ngIf="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched">
                Passwords do not match
              </span>
            </div>
          </div>

          <!-- Password strength bar -->
          <div class="strength-bar" *ngIf="registerForm.get('password')?.value">
            <div class="strength-fill" [style.width]="strengthPercent() + '%'" [class]="strengthClass()"></div>
          </div>
          <div class="strength-label" *ngIf="registerForm.get('password')?.value">
            Strength: <strong>{{ strengthLabel() }}</strong>
          </div>

          <div class="form-group terms-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="terms">
              <span>I agree to the <a routerLink="/terms">Terms of Service</a> and <a routerLink="/privacy">Privacy Policy</a></span>
            </label>
            <span class="error-msg" *ngIf="isInvalid('terms')">You must accept the terms</span>
          </div>

          <div class="server-error" *ngIf="serverError()">
            &#9888; {{ serverError() }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Create Account</span>
            <span *ngIf="isLoading()" class="spinner">&#9696;</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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
      padding: 30px 20px;
    }

    .auth-card {
      background: #111111;
      border: 1.5px solid #2d0a0a;
      border-radius: 24px;
      padding: 44px 40px;
      width: 100%;
      max-width: 560px;
      box-shadow: 0 16px 60px rgba(225,29,72,0.15);
      animation: fadeSlideUp 0.5s ease-out;
    }

    @keyframes fadeSlideUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo { font-size: 48px; margin-bottom: 10px; }

    .auth-header h1 {
      color: #1f2937;
      font-size: 26px;
      font-weight: 700;
      margin: 0 0 6px;
    }

    .auth-header p { color: #6b7280; margin: 0; font-size: 14px; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }

    .form-group { margin-bottom: 20px; }

    label {
      display: block;
      color: rgba(255,255,255,0.65);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 7px;
      letter-spacing: 0.3px;
    }

    .input-wrapper { position: relative; }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="password"] {
      width: 100%;
      background: #1a1a1a;
      border: 1.5px solid #2d0a0a;
      border-radius: 11px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      transition: border-color 0.25s, box-shadow 0.25s;
      outline: none;
      box-sizing: border-box;
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
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255,255,255,0.3);
      font-size: 12px;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 4px;
    }

    .toggle-pw:hover { color: #e11d48; }

    .error-msg {
      display: block;
      color: #ff6b6b;
      font-size: 12px;
      margin-top: 5px;
    }

    .strength-bar {
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 99px;
      margin: -12px 0 4px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      border-radius: 99px;
      transition: width 0.4s ease, background 0.4s ease;
    }

    .strength-fill.weak   { background: #f44336; }
    .strength-fill.fair   { background: #ff9800; }
    .strength-fill.good   { background: #ffeb3b; }
    .strength-fill.strong { background: #4caf50; }

    .strength-label {
      font-size: 11px;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .strength-label strong { color: #374151; }

    .terms-group { margin-top: 4px; }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-weight: normal;
      color: #6b7280;
      font-size: 13px;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      min-width: 16px;
      margin-top: 2px;
      accent-color: #7c3aed;
      cursor: pointer;
    }

    .checkbox-label a {
      color: #7c3aed;
      text-decoration: none;
    }

    .server-error {
      background: rgba(244,67,54,0.12);
      border: 1px solid rgba(244,67,54,0.35);
      border-radius: 10px;
      padding: 12px 16px;
      color: #ff6b6b;
      font-size: 13px;
      margin-bottom: 18px;
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
    }

    .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner { display: inline-block; animation: spin 0.8s linear infinite; }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    .auth-footer { text-align: center; margin-top: 26px; }
    .auth-footer p { color: rgba(255,255,255,0.4); font-size: 14px; margin: 0 0 10px; }
    .auth-footer a { color: #f43f5e; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .auth-footer a:hover { color: #fff; }
    .back-home { display:block; color:rgba(255,255,255,0.25) !important; font-size:13px; font-weight:400 !important; }

    @media (max-width: 560px) {
      .auth-card { padding: 32px 20px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = signal(false);
  serverError = signal('');
  showPw = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
      return;
    }
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone:    ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrength]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: mustMatch('password', 'confirmPassword') });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.registerForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  strengthPercent(): number {
    const pw: string = this.registerForm.get('password')?.value || '';
    let score = 0;
    if (pw.length >= 8) score += 25;
    if (/[A-Z]/.test(pw)) score += 25;
    if (/\d/.test(pw)) score += 25;
    if (/[^A-Za-z0-9]/.test(pw)) score += 25;
    return score;
  }

  strengthClass(): string {
    const p = this.strengthPercent();
    if (p <= 25) return 'weak';
    if (p <= 50) return 'fair';
    if (p <= 75) return 'good';
    return 'strong';
  }

  strengthLabel(): string {
    const p = this.strengthPercent();
    if (p <= 25) return 'Weak';
    if (p <= 50) return 'Fair';
    if (p <= 75) return 'Good';
    return 'Strong';
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.serverError.set('');
    const { fullName, email, phone, password } = this.registerForm.value;

    this.authService.register(fullName, email, phone, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.serverError.set(err.message);
      }
    });
  }
}
