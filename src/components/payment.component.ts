import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovieService, BookingService } from '../services';
import { Seat, Movie } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="payment-container">
      <div class="progress-bar">
        <div class="progress-step completed">
          <span class="step-number">1</span>
          <span class="step-label">Movie</span>
        </div>
        <div class="progress-line completed"></div>
        <div class="progress-step completed">
          <span class="step-number">2</span>
          <span class="step-label">Show Time</span>
        </div>
        <div class="progress-line completed"></div>
        <div class="progress-step completed">
          <span class="step-number">3</span>
          <span class="step-label">Seats</span>
        </div>
        <div class="progress-line active"></div>
        <div class="progress-step active">
          <span class="step-number">4</span>
          <span class="step-label">Payment</span>
        </div>
      </div>

      <div class="payment-content">
        <div class="payment-form-section">
          <h2>💳 Payment Details</h2>

          <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()">
            <!-- Customer Info -->
            <div class="form-section">
              <h3>Customer Information</h3>
              
              <div class="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  formControlName="fullName"
                  placeholder="John Doe"
                  class="form-input">
                <div class="error" *ngIf="isFieldInvalid('fullName')">
                  Full name is required
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    placeholder="john@example.com"
                    class="form-input">
                  <div class="error" *ngIf="isFieldInvalid('email')">
                    Valid email is required
                  </div>
                </div>

                <div class="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    formControlName="phone"
                    placeholder="+91 98765 43210"
                    class="form-input">
                  <div class="error" *ngIf="isFieldInvalid('phone')">
                    Valid phone is required
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-section">
              <h3>Payment Method</h3>
              
              <div class="payment-methods">
                <label class="method-option" [class.selected]="paymentForm.get('method')?.value === 'card'">
                  <input type="radio" formControlName="method" value="card">
                  <span class="method-icon">💳</span>
                  <span class="method-name">Credit/Debit Card</span>
                </label>

                <label class="method-option" [class.selected]="paymentForm.get('method')?.value === 'upi'">
                  <input type="radio" formControlName="method" value="upi">
                  <span class="method-icon">📱</span>
                  <span class="method-name">UPI</span>
                </label>

                <label class="method-option" [class.selected]="paymentForm.get('method')?.value === 'wallet'">
                  <input type="radio" formControlName="method" value="wallet">
                  <span class="method-icon">👛</span>
                  <span class="method-name">Digital Wallet</span>
                </label>
              </div>
            </div>

            <!-- Card Details -->
            <div class="form-section" *ngIf="paymentForm.get('method')?.value === 'card'">
              <h3>Card Details</h3>
              
              <div class="form-group">
                <label>Card Number *</label>
                <input 
                  type="text" 
                  formControlName="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  class="form-input">
                <div class="error" *ngIf="isFieldInvalid('cardNumber')">
                  Valid card number is required
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Expiry Date *</label>
                  <input 
                    type="text" 
                    formControlName="expiry"
                    placeholder="MM/YY"
                    maxlength="5"
                    class="form-input">
                  <div class="error" *ngIf="isFieldInvalid('expiry')">
                    Valid expiry required
                  </div>
                </div>

                <div class="form-group">
                  <label>CVV *</label>
                  <input 
                    type="password" 
                    formControlName="cvv"
                    placeholder="123"
                    maxlength="3"
                    class="form-input">
                  <div class="error" *ngIf="isFieldInvalid('cvv')">
                    CVV is required
                  </div>
                </div>
              </div>
            </div>

            <!-- UPI Details -->
            <div class="form-section" *ngIf="paymentForm.get('method')?.value === 'upi'">
              <h3>UPI Details</h3>
              
              <div class="form-group">
                <label>UPI ID *</label>
                <input 
                  type="text" 
                  formControlName="upiId"
                  placeholder="yourname@upi"
                  class="form-input">
                <div class="error" *ngIf="isFieldInvalid('upiId')">
                  Valid UPI ID is required
                </div>
              </div>
            </div>

            <!-- Wallet Details -->
            <div class="form-section" *ngIf="paymentForm.get('method')?.value === 'wallet'">
              <h3>Digital Wallet</h3>
              
              <div class="form-group">
                <label>Wallet Phone Number *</label>
                <input 
                  type="tel" 
                  formControlName="walletPhone"
                  placeholder="+91 98765 43210"
                  class="form-input">
                <div class="error" *ngIf="isFieldInvalid('walletPhone')">
                  Valid phone is required
                </div>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="form-group checkbox">
              <input 
                type="checkbox" 
                formControlName="terms"
                id="terms">
              <label for="terms">
                I agree to the terms and conditions and cancellation policy
              </label>
              <div class="error" *ngIf="isFieldInvalid('terms')">
                Please accept terms and conditions
              </div>
            </div>

            <!-- Submit -->
            <button 
              type="submit"
              [disabled]="!paymentForm.valid || isProcessing()"
              class="submit-btn">
              <span *ngIf="!isProcessing()">Complete Payment</span>
              <span *ngIf="isProcessing()">Processing...</span>
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <h3>Order Summary</h3>
          
          <div class="summary-section">
            <h4>Selected Seats</h4>
            <div class="seats-list">
              <span *ngFor="let seat of selectedSeats" class="seat-tag">
                {{ seat.seatNo }}
              </span>
            </div>
          </div>

          <div class="price-details">
            <div class="detail-row">
              <span>Subtotal ({{ selectedSeats.length }} seats)</span>
              <span>₹{{ totalPrice }}</span>
            </div>
            <div class="detail-row">
              <span>Taxes & Charges</span>
              <span>₹{{ calculateTax() }}</span>
            </div>
            <div class="detail-row discount" *ngIf="totalPrice > 1000">
              <span>Discount</span>
              <span>-₹{{ calculateDiscount() }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="final-amount">
            <span>Final Amount</span>
            <span class="amount">₹{{ finalAmount() }}</span>
          </div>

          <div class="security-info">
            <p>🔒 Your payment information is secure and encrypted</p>
            <p>✓ 100% Safe & Secure</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      background: linear-gradient(160deg, #0a0a0a 0%, #150505 100%);
      min-height: calc(100vh - 64px);
      padding: 30px 20px;
    }

    .progress-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      max-width: 800px;
      margin: 0 auto 40px;
      flex-wrap: wrap;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .step-number {
      width:35px;height:35px;border-radius:50%;
      background:#1a1a1a;color:#f43f5e;
      display:flex;align-items:center;justify-content:center;
      font-weight:bold;border:2px solid #7f1d1d;
    }
    .progress-step.completed .step-number{background:#9f1239;border-color:#9f1239;color:white;}
    .progress-step.active .step-number{background:#e11d48;border-color:#e11d48;color:white;}
    .step-label{color:rgba(255,255,255,0.6);font-size:12px;font-weight:bold;}
    .progress-line{width:30px;height:2px;background:#2d0a0a;margin:0 5px;}
    .progress-line.completed{background:#9f1239;}
    .progress-line.active{background:#e11d48;}

    .payment-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .payment-form-section {
      background: #111111;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0,0,0,0.6);
      border: 1.5px solid #2d0a0a;
    }

    .payment-form-section h2 {
      color: #fff;
      margin-bottom: 30px;
      font-size: 20px;
    }

    .form-section {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid #2d0a0a;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      color: rgba(255,255,255,0.7);
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: rgba(255,255,255,0.6);
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 13px;
    }

    .form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid #2d0a0a;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s, box-shadow 0.3s;
      background: #1a1a1a;
      color: #fff;
      outline: none;
      box-sizing: border-box;
    }

    .form-input::placeholder { color: rgba(255,255,255,0.2); }

    .form-input:focus {
      outline: none;
      border-color: #e11d48;
      box-shadow: 0 0 0 3px rgba(225,29,72,0.15);
    }

    .form-input.ng-invalid.ng-touched {
      border-color: #f44336;
    }

    .error {
      color: #f44336;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .method-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      border: 2px solid #2d0a0a;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s;
      background: #1a1a1a;
      color: rgba(255,255,255,0.65);
    }

    .method-option input[type="radio"] {
      display: none;
    }

    .method-option:hover {
      border-color: #e11d48;
      background: rgba(225,29,72,0.08);
    }

    .method-option.selected {
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      border-color: #e11d48;
      color: white;
    }

    .method-icon {
      font-size: 28px;
    }

    .method-name {
      font-weight: 500;
      text-align: center;
      font-size: 13px;
    }

    .checkbox {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .checkbox input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin-top: 2px;
      cursor: pointer;
    }

    .checkbox label {
      margin: 0;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      font-size: 14px;
      font-weight: normal;
    }

    .submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      color: white;
      border: none;
      padding: 15px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.3s;
      margin-top: 20px;
    }

    .submit-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .order-summary {
      background: #111111;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0,0,0,0.6);
      border: 1.5px solid #2d0a0a;
      height: fit-content;
      position: sticky;
      top: 30px;
    }

    .order-summary h3 {
      color: #fff;
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 2px solid #e11d48;
      padding-bottom: 10px;
    }

    .summary-section {
      margin-bottom: 20px;
    }

    .summary-section h4 {
      color: rgba(255,255,255,0.45);
      margin: 0 0 10px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .seats-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .seat-tag {
      background: rgba(225,29,72,0.15);
      color: #f43f5e;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      border: 1px solid #7f1d1d;
    }

    .price-details {
      background: #1a1a1a;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: rgba(255,255,255,0.5);
      font-size: 13px;
    }

    .detail-row span:last-child { color: rgba(255,255,255,0.8); font-weight: 600; }

    .detail-row.discount {
      color: #22c55e;
      font-weight: bold;
    }

    .detail-row:last-child { margin-bottom: 0; }

    .divider { height: 1px; background: #2d0a0a; margin: 15px 0; }

    .final-amount {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 20px;
    }

    .amount { color: #f43f5e; font-size: 22px; }

    .security-info {
      background: rgba(225,29,72,0.08);
      border-left: 4px solid #e11d48;
      padding: 12px;
      border-radius: 5px;
      font-size: 12px;
      color: #f87171;
    }

    .security-info p {
      margin: 5px 0;
    }

    .security-info p:first-child {
      margin-top: 0;
    }

    .security-info p:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 1024px) {
      .payment-content {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .payment-form-section {
        padding: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .payment-methods {
        grid-template-columns: 1fr;
      }

      .method-option {
        flex-direction: row;
        justify-content: flex-start;
      }
    }
  `]
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentForm!: FormGroup;
  selectedSeats: Seat[] = [];
  totalPrice = 0;
  isProcessing = signal(false);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private movieService: MovieService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.selectedSeats = nav.extras.state.seats || [];
      this.totalPrice = nav.extras.state.totalPrice || 0;
    }
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.paymentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      method: ['card', Validators.required],
      cardNumber: [''],
      expiry: [''],
      cvv: [''],
      upiId: [''],
      walletPhone: [''],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.paymentMethodValidator });

    // Update validators based on payment method
    this.paymentForm.get('method')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.paymentForm.updateValueAndValidity();
      });
  }

  private paymentMethodValidator(group: FormGroup): { [key: string]: any } | null {
    const method = group.get('method')?.value;

    if (method === 'card') {
      group.get('cardNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{16}$/)
      ]);
      group.get('expiry')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\/\d{2}$/)
      ]);
      group.get('cvv')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}$/)
      ]);
      group.get('upiId')?.clearValidators();
      group.get('walletPhone')?.clearValidators();
    } else if (method === 'upi') {
      group.get('upiId')?.setValidators([
        Validators.required,
        Validators.pattern(/^[\w\.\-]+@[a-zA-Z]+$/)
      ]);
      group.get('cardNumber')?.clearValidators();
      group.get('expiry')?.clearValidators();
      group.get('cvv')?.clearValidators();
      group.get('walletPhone')?.clearValidators();
    } else if (method === 'wallet') {
      group.get('walletPhone')?.setValidators([
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]);
      group.get('cardNumber')?.clearValidators();
      group.get('expiry')?.clearValidators();
      group.get('cvv')?.clearValidators();
      group.get('upiId')?.clearValidators();
    }

    group.get('cardNumber')?.updateValueAndValidity({ emitEvent: false });
    group.get('expiry')?.updateValueAndValidity({ emitEvent: false });
    group.get('cvv')?.updateValueAndValidity({ emitEvent: false });
    group.get('upiId')?.updateValueAndValidity({ emitEvent: false });
    group.get('walletPhone')?.updateValueAndValidity({ emitEvent: false });

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  calculateTax(): number {
    return Math.round(this.totalPrice * 0.18);
  }

  calculateDiscount(): number {
    return this.totalPrice > 1000 ? this.selectedSeats.length * 50 : 0;
  }

  finalAmount(): number {
    return this.totalPrice + this.calculateTax() - this.calculateDiscount();
  }

  submitPayment() {
    if (this.paymentForm.valid && !this.isProcessing()) {
      this.isProcessing.set(true);

      // Simulate payment processing
      setTimeout(() => {
        this.router.navigate(['/confirmation'], {
          state: {
            bookingId: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            totalAmount: this.finalAmount(),
            seats: this.selectedSeats,
            method: this.paymentForm.get('method')?.value
          }
        });
      }, 2000);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
