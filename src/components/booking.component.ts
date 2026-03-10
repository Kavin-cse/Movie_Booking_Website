import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SeatService, MovieService, BookingService } from '../services';
import { Seat, Movie } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="booking-container">
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
        <div class="progress-line active"></div>
        <div class="progress-step active">
          <span class="step-number">3</span>
          <span class="step-label">Seats</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
          <span class="step-number">4</span>
          <span class="step-label">Payment</span>
        </div>
      </div>

      <div class="booking-content">
        <div class="seat-selection">
          <h2>🎟 Select Your Seats</h2>
          
          <div class="legend">
            <div class="legend-item">
              <div class="seat regular"></div>
              <span>Regular ₹150</span>
            </div>
            <div class="legend-item">
              <div class="seat premium"></div>
              <span>Premium ₹200</span>
            </div>
            <div class="legend-item">
              <div class="seat vip"></div>
              <span>VIP ₹250</span>
            </div>
            <div class="legend-item">
              <div class="seat booked"></div>
              <span>Booked</span>
            </div>
          </div>

          <div class="screen">SCREEN →</div>

          <div class="seats-grid">
            <div *ngFor="let seat of seats()" 
              class="seat-wrapper"
              [class.row-label]="isRowLabel(seat)">
              
              <span *ngIf="isRowLabel(seat)" class="row-label-text">{{ seat.row }}</span>
              
              <button *ngIf="!isRowLabel(seat)"
                class="seat"
                [ngClass]="[seat.category, seat.isSelected ? 'selected' : '', !seat.isAvailable ? 'disabled' : '']"
                [disabled]="!seat.isAvailable"
                (click)="selectSeat(seat)"
                [title]="seat.seatNo + ' - ₹' + seat.price"
                [attr.aria-label]="'Seat ' + seat.seatNo + ' - ₹' + seat.price">
                {{ seat.column }}
              </button>
            </div>
          </div>

          <div class="legend-booked" *ngIf="hasBookedSeats()">
            <p>Some seats are already booked</p>
          </div>
        </div>

        <div class="booking-summary">
          <h3>Booking Summary</h3>
          
          <div class="summary-item">
            <span>Movie:</span>
            <span class="value">{{ movieTitle }}</span>
          </div>
          
          <div class="summary-item">
            <span>Selected Seats:</span>
            <span class="value">
              <span *ngIf="selectedSeats().length > 0">
                {{ selectedSeatsText() }}
              </span>
              <span *ngIf="selectedSeats().length === 0" class="empty">None</span>
            </span>
          </div>

          <div class="price-breakdown">
            <div class="breakdown-item" *ngFor="let category of categoryBreakdown()">
              <span>{{ category.category }} x {{ category.count }} seats</span>
              <span>&#8377;{{ category.subtotal }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="total">
            <span>Total Amount:</span>
            <span class="total-price">₹{{ totalPrice() }}</span>
          </div>

          <div class="discount-banner" *ngIf="totalPrice() > 1000">
            <p>You saved Rs.{{ discountSavings() }} with our offer!</p>
          </div>

          <button 
            [disabled]="selectedSeats().length === 0"
            (click)="proceedToPayment()"
            class="payment-btn">
            Proceed to Payment
          </button>

          <a routerLink="/" class="back-link">← Back to Movies</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-container {
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
      width: 35px; height: 35px; border-radius: 50%;
      background: #1a1a1a; color: #f43f5e;
      display: flex; align-items: center; justify-content: center;
      font-weight: bold; border: 2px solid #7f1d1d;
    }
    .progress-step.completed .step-number { background: #9f1239; border-color: #9f1239; color: white; }
    .progress-step.active .step-number { background: #e11d48; border-color: #e11d48; color: white; }
    .step-label { color: rgba(255,255,255,0.6); font-size: 12px; font-weight: bold; }
    .progress-line { width: 30px; height: 2px; background: #2d0a0a; margin: 0 5px; }
    .progress-line.completed { background: #9f1239; }
    .progress-line.active { background: #e11d48; }

    .booking-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .seat-selection {
      background: #111111;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0,0,0,0.5);
      border: 1.5px solid #2d0a0a;
    }
    .seat-selection h2 { color: #fff; margin-bottom: 20px; text-align: center; }
    .legend { display: grid; grid-template-columns: repeat(2,1fr); gap: 15px; margin-bottom: 30px; padding: 20px; background: #1a1a1a; border-radius: 10px; }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .legend-item .seat {
      width: 35px;
      height: 35px;
    }

    .screen {
      text-align: center;
      background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
      color: #fbbf24;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-weight: 800;
      letter-spacing: 4px;
      font-size: 13px;
      border: 1px solid #333;
      box-shadow: 0 4px 20px rgba(251,191,36,0.08);
    }

    .seats-grid {
      display: grid;
      grid-template-columns: 30px repeat(12, 1fr);
      grid-auto-rows: 50px;
      gap: 8px;
      margin-bottom: 20px;
      padding: 20px;
      background: #0d0d0d;
      border-radius: 12px;
      border: 1px solid #1a1a1a;
      overflow-x: auto;
    }

    .seat-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
    }

    .seat-wrapper.row-label {
      grid-column: 1;
      justify-content: center;
    }

    .row-label-text {
      font-weight: 700;
      color: rgba(255,255,255,0.4);
      font-size: 13px;
    }

    .seat {
      width: 100%;
      height: 40px;
      border: 2px solid #2a2a2a;
      border-radius: 6px;
      background: #1e1e1e;
      cursor: pointer;
      font-weight: 700;
      font-size: 10px;
      color: rgba(255,255,255,0.35);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;
    }

    .seat.regular {
      background: #14532d;
      border-color: #22c55e;
      color: #86efac;
    }

    .seat.premium {
      background: #1e3a5f;
      border-color: #3b82f6;
      color: #93c5fd;
    }

    .seat.vip {
      background: #451a03;
      border-color: #f97316;
      color: #fdba74;
    }

    .seat:hover:not(.disabled) {
      transform: scale(1.12);
      box-shadow: 0 0 10px rgba(225,29,72,0.4);
    }

    .seat.selected {
      background: #e11d48 !important;
      color: white !important;
      border-color: #f43f5e !important;
      box-shadow: 0 0 12px rgba(225,29,72,0.6);
    }

    .seat.disabled {
      background: #1a1a1a !important;
      border-color: #333 !important;
      color: #333 !important;
      cursor: not-allowed;
      opacity: 0.4;
    }

    .legend-item span { color: rgba(255,255,255,0.75); font-size: 13px; }

    .legend-booked {
      text-align: center;
      color: #ff9800;
      font-weight: bold;
      margin-top: 15px;
    }

    .booking-summary {
      background: #111111;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0,0,0,0.5);
      border: 1.5px solid #2d0a0a;
      height: fit-content;
      position: sticky;
      top: 30px;
    }
    .booking-summary h3 { color: #fff; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #e11d48; padding-bottom: 10px; }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      color: rgba(255,255,255,0.5);
    }

    .summary-item .value {
      font-weight: bold;
      color: #fff;
      word-break: break-word;
      text-align: right;
      flex: 0 0 50%;
    }

    .empty { color: rgba(255,255,255,0.25); }

    .price-breakdown { background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 15px 0; }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      color: rgba(255,255,255,0.5);
    }

    .breakdown-item:last-child { margin-bottom: 0; }

    .divider { height: 1px; background: #2d0a0a; margin: 15px 0; }

    .total {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 15px;
    }

    .total-price { color: #f43f5e; font-size: 22px; }
    .discount-banner { background: rgba(225,29,72,0.1); border-left: 4px solid #e11d48; padding: 12px; border-radius: 5px; margin-bottom: 15px; color: #f87171; font-size: 13px; font-weight: bold; }
    .payment-btn { width: 100%; background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%); color: white; border: none; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: opacity 0.3s; margin-bottom: 10px; }
    .payment-btn:hover { opacity: 0.9; }
    .back-link {
      display: block;
      text-align: center;
      color: #f43f5e;
      text-decoration: none;
      font-size: 14px;
    }

    .back-link:hover { text-decoration: underline; }

    @media (max-width: 1024px) {
      .booking-content {
        grid-template-columns: 1fr;
      }

      .booking-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .seat-selection {
        padding: 20px;
      }

      .seats-grid {
        grid-template-columns: 25px repeat(8, 1fr);
        gap: 8px;
      }

      .seat {
        width: 35px;
        height: 35px;
        font-size: 10px;
      }

      .legend {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingComponent implements OnInit, OnDestroy {
  seats = signal<Seat[]>([]);
  selectedSeats = computed(() => this.seats().filter(s => s.isSelected));
  selectedSeatsText = computed(() => this.selectedSeats().map(s => s.seatNo).join(', '));
  hasBookedSeats = computed(() => this.seats().some(s => !s.isAvailable));
  totalPrice = computed(() => this.selectedSeats().reduce((sum, s) => sum + s.price, 0));
  discountSavings = computed(() => this.selectedSeats().length * 50);
  movieTitle = 'Selected Movie';
  private destroy$ = new Subject<void>();

  constructor(
    private seatService: SeatService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.movieTitle = nav.extras.state.movieTitle;
    }
  }

  ngOnInit() {
    // First initialize the seats (populates the BehaviorSubject), then subscribe
    this.seatService.initializeSeats('default').subscribe();
    this.seatService.getSeats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(seats => {
        if (seats.length > 0) {
          this.seats.set(this.arrangeSeatsInGrid(seats));
        }
      });
  }

  private arrangeSeatsInGrid(seats: Seat[]): Seat[] {
    const rowLabels: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    rows.forEach(row => {
      const label: any = { seatNo: row, row, isRowLabel: true };
      rowLabels.push(label);
      
      const rowSeats = seats.filter(s => s.row === row).sort((a, b) => a.column - b.column);
      rowLabels.push(...rowSeats);
    });

    return rowLabels;
  }

  isRowLabel(seat: Seat): boolean {
    return (seat as any).isRowLabel === true;
  }

  selectSeat(seat: Seat) {
    this.seatService.selectSeat(seat.id);
  }

  categoryBreakdown() {
    const breakdown = new Map<string, { count: number; subtotal: number }>();
    
    this.selectedSeats().forEach(seat => {
      const cat = seat.category;
      if (!breakdown.has(cat)) {
        breakdown.set(cat, { count: 0, subtotal: 0 });
      }
      const current = breakdown.get(cat)!;
      current.count++;
      current.subtotal += seat.price;
    });

    return Array.from(breakdown.entries()).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      ...data
    }));
  }

  proceedToPayment() {
    if (this.selectedSeats().length > 0) {
      this.router.navigate(['/payment'], {
        state: {
          seats: this.selectedSeats(),
          totalPrice: this.totalPrice()
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
