import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MovieService, SeatService } from '../services';
import { Movie, ShowTime } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container" *ngIf="movie()">
      <div class="back-button">
        <a routerLink="/"><< Back to Movies</a>
      </div>

      <div class="movie-detail">
        <div class="poster-section">
          <img [src]="movie()!.posterUrl" [alt]="movie()!.title" class="poster">
          <div class="rating-badge">⭐ {{ movie()!.rating }}/10</div>
        </div>

        <div class="info-section">
          <h1>{{ movie()!.title }}</h1>
          <div class="meta-info">
            <span class="badge">{{ movie()!.genre }}</span>
            <span class="badge">{{ movie()!.duration }} minutes</span>
            <span class="badge">{{ movie()!.language }}</span>
          </div>

          <div class="details">
            <div class="detail-item">
              <strong>Director:</strong> {{ movie()!.director }}
            </div>
            <div class="detail-item">
              <strong>Cast:</strong> {{ movie()!.cast.join(', ') }}
            </div>
            <div class="detail-item">
              <strong>Release:</strong> {{ movie()!.releaseDate | date: 'MMM dd, yyyy' }}
            </div>
          </div>

          <p class="description">{{ movie()!.description }}</p>

          <div class="show-times-section">
            <h3>Select Show Time</h3>
            <div class="show-times">
              <button
                *ngFor="let show of movie()!.showTimes"
                [class.selected]="selectedShowTime() === show.id"
                [class.disabled]="show.availableSeats === 0"
                [disabled]="show.availableSeats === 0"
                (click)="selectShowTime(show)"
                class="show-time-btn">
                <div class="time">{{ show.time }}</div>
                <div class="format">{{ show.format }} • {{ show.language }}</div>
                <div class="availability">
                  <span *ngIf="show.availableSeats > 0" class="available">
                    {{ show.availableSeats }} seats
                  </span>
                  <span *ngIf="show.availableSeats === 0" class="sold-out">
                    SOLD OUT
                  </span>
                </div>
              </button>
            </div>
          </div>

          <button 
            *ngIf="selectedShowTime()"
            (click)="proceedToBooking()"
            class="proceed-btn">
            Proceed to Seat Selection →
          </button>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!movie()">
      <p>Loading movie details...</p>
    </div>
  `,
  styles: [`
    .detail-container {
      background: linear-gradient(160deg, #0a0a0a 0%, #150505 100%);
      min-height: calc(100vh - 64px);
      padding: 30px 20px;
    }

    .back-button {
      max-width: 1000px;
      margin: 0 auto 20px;
    }

    .back-button a {
      color: #f43f5e;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      transition: color 0.2s;
    }

    .back-button a:hover { color: #fff; }

    .movie-detail {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 40px;
      max-width: 1000px;
      margin: 0 auto;
      background: #111111;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      border: 1.5px solid #2d0a0a;
    }

    .poster-section {
      position: relative;
    }

    .poster {
      width: 100%;
      border-radius: 12px;
      height: 400px;
      object-fit: contain;
      background: #1a1a2e;
    }

    .rating-badge {
      position: absolute;
      bottom: 15px;
      right: 15px;
      background: #ffc107;
      color: #333;
      padding: 10px 15px;
      border-radius: 8px;
      font-weight: bold;
    }

    .info-section h1 {
      margin: 0 0 20px;
      color: #333;
      font-size: 32px;
    }

    .meta-info {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .badge {
      background: rgba(225,29,72,0.15);
      color: #f43f5e;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 13px;
      font-weight: bold;
      border: 1px solid #7f1d1d;
    }

    .details {
      background: #1a1a1a;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }

    .details p { color: rgba(255,255,255,0.6); margin: 5px 0; font-size: 14px; }
    .details strong { color: #fff; }

    .detail-item {
      margin: 10px 0;
      color: #555;
      line-height: 1.5;
    }

    .description {
      color: #666;
      line-height: 1.6;
      margin: 20px 0;
    }

    .show-times-section h3 {
      margin: 30px 0 15px;
      color: #333;
    }

    .show-times {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .show-time-btn {
      background: #1a1a1a;
      border: 2px solid #2d0a0a;
      padding: 15px;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s;
      font-size: 14px;
      color: rgba(255,255,255,0.6);
    }

    .show-time-btn:hover:not(.disabled) {
      border-color: #e11d48;
      background: rgba(225,29,72,0.1);
    }

    .show-time-btn.selected {
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      color: white;
      border-color: #e11d48;
    }

    .show-time-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .time {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 16px;
    }

    .format {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }

    .show-time-btn.selected .format {
      color: rgba(255, 255, 255, 0.8);
    }

    .availability {
      font-size: 12px;
      font-weight: bold;
      margin-top: 5px;
    }

    .available {
      color: #4caf50;
    }

    .show-time-btn.selected .available {
      color: #fff;
    }

    .sold-out {
      color: #f44336;
    }

    .proceed-btn {
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.3s, transform 0.2s;
    }

    .proceed-btn:hover { opacity: 0.9; transform: translateY(-1px); }

    .loading { color: #f43f5e; text-align: center; padding: 60px 20px; }

    @media (max-width: 768px) {
      .movie-detail {
        grid-template-columns: 1fr;
        padding: 20px;
      }
    }
  `]
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie = signal<Movie | undefined>(undefined);
  selectedShowTime = signal<string>('');
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private seatService: SeatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params['id']);
        this.movieService.getMovieById(id).subscribe(movie => {
          this.movie.set(movie);
          this.selectedShowTime.set('');
        });
      });
  }

  selectShowTime(show: ShowTime) {
    this.selectedShowTime.set(show.id);
  }

  proceedToBooking() {
    if (this.movie() && this.selectedShowTime()) {
      this.seatService.initializeSeats(this.selectedShowTime()).subscribe(() => {
        this.router.navigate(['/booking'], {
          state: {
            movieId: this.movie()!.id,
            showTimeId: this.selectedShowTime(),
            movieTitle: this.movie()!.title
          }
        });
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
