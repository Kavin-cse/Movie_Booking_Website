import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Seat } from '../models';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-container">
      <div class="success-card">
        <div class="success-icon">✓</div>
        
        <h1>Booking Confirmed!</h1>
        <p class="subtitle">Your movie tickets have been successfully booked</p>

        <div class="confirmation-details">
          <div class="detail-box">
            <h3>Booking Reference</h3>
            <p class="booking-id">{{ bookingId }}</p>
            <button (click)="copyToClipboard(bookingId)" class="copy-btn">Copy</button>
          </div>

          <div class="detail-grid">
            <div class="detail-box">
              <h3>Seats</h3>
              <div class="seats-display">
                <span *ngFor="let seat of seats" class="seat-badge">{{ seat.seatNo }}</span>
              </div>
            </div>

            <div class="detail-box">
              <h3>Amount Paid</h3>
              <p class="amount">₹{{ totalAmount }}</p>
            </div>

            <div class="detail-box">
              <h3>Payment Method</h3>
              <p class="method">{{ getPaymentMethodName() }}</p>
            </div>

            <div class="detail-box">
              <h3>Booking Time</h3>
              <p class="time">{{ bookingTime | date: 'short' }}</p>
            </div>
          </div>
        </div>

        <div class="important-info">
          <h3>📋 Important Information</h3>
          <ul>
            <li>Your booking is confirmed and a confirmation email has been sent</li>
            <li>Please arrive at least 15 minutes before the show time</li>
            <li>Present this booking ID at the cinema counter</li>
            <li>Cancellation/Modification allowed up to 2 hours before show time</li>
            <li>Refund will be processed within 5-7 business days</li>
          </ul>
        </div>

        <div class="actions">
          <button class="download-btn" (click)="downloadTicket()">⬇️ Download Ticket</button>
          <button class="email-btn" (click)="emailTicket()">📧 Email Ticket</button>
          <a routerLink="/" class="home-btn">← Back to Home</a>
        </div>
      </div>

      <div class="ticket-preview">
        <div class="ticket">
          <div class="ticket-header">
            <div class="cinema-name">🎬 CINEMA PALACE</div>
          </div>
          
          <div class="ticket-content">
            <div class="ticket-row">
              <span>Booking ID</span>
              <span class="ticket-value">{{ bookingId }}</span>
            </div>
            <div class="ticket-row">
              <span>Seats</span>
              <span class="ticket-value">{{ getSeatsString() }}</span>
            </div>
            <div class="ticket-row">
              <span>Amount</span>
              <span class="ticket-value">₹{{ totalAmount }}</span>
            </div>
          </div>

          <div class="barcode">||||| ||||| |||||</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      background: linear-gradient(160deg, #0a0a0a 0%, #150505 100%);
      min-height: calc(100vh - 64px);
      padding: 40px 20px;
      display: flex;
      gap: 40px;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .success-card {
      background: #111111;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.7);
      border: 1.5px solid #2d0a0a;
      max-width: 600px;
      width: 100%;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50px;
      color: white;
      margin: 0 auto 20px;
      animation: scaleUp 0.6s ease-out;
    }

    @keyframes scaleUp {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }

    .success-card h1 {
      text-align: center;
      color: #333;
      margin: 0 0 10px;
      font-size: 28px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }

    .confirmation-details {
      background: #1a1a1a;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #2d0a0a; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: rgba(255,255,255,0.45); font-size: 13px; }
    .detail-value { color: #fff; font-weight: 600; font-size: 13px; }

    .detail-box {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .detail-box h3 {
      color: #666;
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .detail-box p {
      margin: 0;
      color: #333;
      font-weight: bold;
      font-size: 16px;
    }

    .booking-id {
      font-family: 'Courier New', monospace;
      font-size: 18px;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }

    .copy-btn { background: #e11d48; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-size:12px; font-weight:bold; }
    .copy-btn:hover { opacity: 0.9; }

    .seats-display { display:flex; flex-wrap:wrap; gap:8px; }

    .seat-badge {
      background: rgba(225,29,72,0.15);
      color: #f43f5e;
      padding: 6px 10px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      border: 1px solid #7f1d1d;
    }

    .amount {
      color: #4caf50;
      font-size: 20px !important;
    }

    .method { color: #f43f5e; }

    .time {
      color: #666;
      font-size: 14px !important;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .important-info {
      background: rgba(225,29,72,0.08);
      border-left: 4px solid #e11d48;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .important-info h3 { color: #f43f5e; margin: 0 0 10px; font-size: 14px; }
    .important-info ul { list-style:none; padding:0; margin:0; }
    .important-info li { color: #f87171; padding: 5px 0; padding-left: 20px; position: relative; font-size: 13px; }

    .important-info li::before {
      content: '✓';
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .download-btn,
    .email-btn,
    .home-btn {
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.3s;
      text-decoration: none;
      text-align: center;
      display: block;
    }

    .download-btn { background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%); color: white; }
    .email-btn { background: #1a1a1a; color: #f43f5e; border: 2px solid #7f1d1d; }
    .home-btn { background: #9f1239; color: white; }

    .download-btn:hover,
    .home-btn:hover {
      opacity: 0.9;
    }

    .email-btn:hover {
      background: #eeeeee;
    }

    .ticket-preview {
      width: 100%;
      max-width: 300px;
    }

    .ticket {
      background: #111111;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(225,29,72,0.2);
      border: 1.5px solid #2d0a0a;
      animation: slideUp 0.8s ease-out;
    }

    .ticket-header {
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      padding: 20px;
      text-align: center;
      color: white;
    }

    .cinema-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .ticket-content {
      padding: 20px;
    }

    .ticket-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #ddd;
      font-size: 13px;
      color: #666;
    }

    .ticket-row:last-of-type {
      border-bottom: none;
    }

    .ticket-value {
      font-weight: bold;
      color: #333;
    }

    .barcode {
      text-align: center;
      padding: 15px;
      background: #1a1a1a;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      letter-spacing: 3px;
      color: #7f1d1d;
    }

    @media (max-width: 768px) {
      .confirmation-container {
        flex-direction: column;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ConfirmationComponent implements OnInit {
  bookingId = '';
  seats: Seat[] = [];
  totalAmount = 0;
  paymentMethod = '';
  bookingTime = new Date();

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.bookingId = nav.extras.state.bookingId;
      this.seats = nav.extras.state.seats || [];
      this.totalAmount = nav.extras.state.totalAmount || 0;
      this.paymentMethod = nav.extras.state.method || 'card';
    }
  }

  ngOnInit() {
    if (!this.bookingId) {
      this.router.navigate(['/']);
    }
  }

  getPaymentMethodName(): string {
    const methods: { [key: string]: string } = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI',
      'wallet': 'Digital Wallet'
    };
    return methods[this.paymentMethod] || 'Unknown';
  }

  getSeatsString(): string {
    return this.seats.map(s => s.seatNo).join(', ');
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Booking ID copied to clipboard!');
    });
  }

  downloadTicket() {
    alert('Ticket download will be implemented');
  }

  emailTicket() {
    alert('Ticket has been sent to your email!');
  }
}
