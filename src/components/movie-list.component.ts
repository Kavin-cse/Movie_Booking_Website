import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services';
import { Movie } from '../models';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="movies-container">

      <!-- ====== ANIMATED BACKGROUND LAYER ====== -->
      <div class="bg-animation" aria-hidden="true">
        <!-- Glowing orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
        <div class="orb orb-5"></div>

        <!-- Floating emoji objects -->
        <span class="float-obj f1">🎬</span>
        <span class="float-obj f2">🎞️</span>
        <span class="float-obj f3">⭐</span>
        <span class="float-obj f4">🎭</span>
        <span class="float-obj f5">🍿</span>
        <span class="float-obj f6">🎥</span>
        <span class="float-obj f7">✨</span>
        <span class="float-obj f8">🎦</span>

        <!-- Moving sparkle dots -->
        <div class="spark s1"></div>
        <div class="spark s2"></div>
        <div class="spark s3"></div>
        <div class="spark s4"></div>
        <div class="spark s5"></div>
        <div class="spark s6"></div>
        <div class="spark s7"></div>
        <div class="spark s8"></div>
        <div class="spark s9"></div>
        <div class="spark s10"></div>
        <div class="spark s11"></div>
        <div class="spark s12"></div>
      </div>

      <!-- ====== PAGE CONTENT ====== -->
      <div class="content-wrapper">
        <div class="filter-section">
          <h3>Filter by Genre</h3>
          <div class="filter-buttons">
            <button
              *ngFor="let genre of genres"
              [class.active]="selectedGenre() === genre"
              (click)="filterByGenre(genre)">
              {{ genre }}
            </button>
          </div>
        </div>

        <div class="movies-grid">
          <div *ngIf="!movies().length" class="no-movies">
            <p>No movies available. Please try again later.</p>
          </div>

          <div *ngFor="let movie of movies()" class="movie-card" [routerLink]="['/movie', movie.id]">
            <div class="movie-image">
              <img [src]="movie.posterUrl" [alt]="movie.title" class="placeholder">
              <span class="rating">⭐ {{ movie.rating }}</span>
            </div>
            <div class="movie-info">
              <h3>{{ movie.title }}</h3>
              <p class="genre">{{ movie.genre }} • {{ movie.duration }}m</p>
              <p class="language">{{ movie.language }}</p>
              <p class="director">Dir: {{ movie.director }}</p>
              <div class="shows-count">
                <span class="badge">{{ movie.showTimes.length }} shows</span>
              </div>
              <button class="book-btn" (click)="$event.preventDefault()">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===== OUTER WRAPPER ===== */
    .movies-container {
      position: relative;
      min-height: calc(100vh - 64px);
      background: linear-gradient(160deg, #0a0a0a 0%, #0f0505 50%, #150505 100%);
      overflow: hidden;
    }

    /* ===== ANIMATED BACKGROUND LAYER ===== */
    .bg-animation {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    /* --- Glowing gradient orbs --- */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      opacity: 0.35;
      animation: orbFloat linear infinite;
    }

    .orb-1 { width:500px; height:500px; background: radial-gradient(circle, #e11d48, #9f1239); top:-100px; left:-150px; animation: orbMove1 18s linear infinite; }
    .orb-2 { width:400px; height:400px; background: radial-gradient(circle, #f43f5e, #be123c); bottom:-80px; right:-100px; animation: orbMove2 22s linear infinite; }
    .orb-3 { width:300px; height:300px; background: radial-gradient(circle, #fb7185, #e11d48); top:40%; left:55%; animation: orbMove3 16s linear infinite; }
    .orb-4 { width:250px; height:250px; background: radial-gradient(circle, #f43f5e, #9f1239); top:20%; right:10%; animation: orbMove4 25s linear infinite; }
    .orb-5 { width:350px; height:350px; background: radial-gradient(circle, #e11d48, #7f1d1d); bottom:10%; left:30%; opacity:0.12; animation: orbMove5 20s linear infinite; }

    @keyframes orbMove1 {
      0%   { transform: translate(0px, 0px) scale(1); }
      33%  { transform: translate(80px, 120px) scale(1.1); }
      66%  { transform: translate(-40px, 80px) scale(0.95); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes orbMove2 {
      0%   { transform: translate(0px, 0px) scale(1); }
      40%  { transform: translate(-100px, -80px) scale(1.08); }
      70%  { transform: translate(60px, -120px) scale(0.92); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes orbMove3 {
      0%   { transform: translate(0, 0) rotate(0deg); }
      50%  { transform: translate(-120px, 80px) rotate(180deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }
    @keyframes orbMove4 {
      0%   { transform: translate(0, 0) scale(1); }
      30%  { transform: translate(-60px, 100px) scale(1.15); }
      60%  { transform: translate(80px, 40px) scale(0.9); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes orbMove5 {
      0%   { transform: translate(0, 0); }
      25%  { transform: translate(100px, -60px); }
      75%  { transform: translate(-80px, 80px); }
      100% { transform: translate(0, 0); }
    }

    /* --- Floating emoji objects --- */
    .float-obj {
      position: absolute;
      font-size: 28px;
      opacity: 0.12;
      animation: floatUp linear infinite;
      user-select: none;
    }

    .f1  { left:  5%; animation-duration: 12s; animation-delay: 0s;   font-size: 32px; }
    .f2  { left: 14%; animation-duration: 17s; animation-delay: 2s;   font-size: 24px; }
    .f3  { left: 24%; animation-duration: 14s; animation-delay: 4s;   font-size: 20px; }
    .f4  { left: 35%; animation-duration: 19s; animation-delay: 1s;   font-size: 30px; }
    .f5  { left: 50%; animation-duration: 15s; animation-delay: 6s;   font-size: 26px; }
    .f6  { left: 63%; animation-duration: 21s; animation-delay: 3s;   font-size: 28px; }
    .f7  { left: 75%; animation-duration: 13s; animation-delay: 7s;   font-size: 18px; }
    .f8  { left: 88%; animation-duration: 16s; animation-delay: 0.5s; font-size: 24px; }

    @keyframes floatUp {
      0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0;    }
      5%   { opacity: 0.15; }
      90%  { opacity: 0.12; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0;    }
    }

    /* --- Sparkle dots --- */
    .spark {
      position: absolute;
      border-radius: 50%;
      background: #7c3aed;
      animation: sparkDrift ease-in-out infinite alternate;
    }

    .s1 {width:6px;height:6px;top:10%;left:8%;  opacity:.25;animation-duration:4s;  animation-delay:0s;  background:#e11d48;}
    .s2 {width:4px;height:4px;top:20%;left:20%; opacity:.18;animation-duration:5s;  animation-delay:1s;  background:#f43f5e;}
    .s3 {width:8px;height:8px;top:35%;left:40%; opacity:.2; animation-duration:6s;  animation-delay:2s;  background:#e11d48;}
    .s4 {width:5px;height:5px;top:60%;left:10%; opacity:.18;animation-duration:4.5s;animation-delay:0.5s;background:#fb7185;}
    .s5 {width:7px;height:7px;top:75%;left:55%; opacity:.25;animation-duration:5.5s;animation-delay:1.5s;background:#e11d48;}
    .s6 {width:4px;height:4px;top:85%;left:75%; opacity:.18;animation-duration:6.5s;animation-delay:3s;  background:#f43f5e;}
    .s7 {width:9px;height:9px;top:15%;left:70%; opacity:.18;animation-duration:7s;  animation-delay:2.5s;background:#e11d48;}
    .s8 {width:5px;height:5px;top:45%;left:85%; opacity:.22;animation-duration:4s;  animation-delay:4s;  background:#fb7185;}
    .s9 {width:6px;height:6px;top:55%;left:30%; opacity:.18;animation-duration:5s;  animation-delay:0.8s;background:#e11d48;}
    .s10{width:4px;height:4px;top:90%;left:45%; opacity:.25;animation-duration:6s;  animation-delay:1.2s;background:#f43f5e;}
    .s11{width:7px;height:7px;top:30%;left:92%; opacity:.18;animation-duration:4.5s;animation-delay:3.5s;background:#e11d48;}
    .s12{width:5px;height:5px;top:68%;left:60%; opacity:.22;animation-duration:5.5s;animation-delay:2.2s;background:#fb7185;}

    @keyframes sparkDrift {
      0%   { transform: translate(0, 0) scale(1);   }
      50%  { transform: translate(20px, -30px) scale(1.4); }
      100% { transform: translate(-15px, 20px) scale(0.7); }
    }

    /* ===== CONTENT WRAPPER (sits above animation) ===== */
    .content-wrapper {
      position: relative;
      z-index: 1;
      padding: 30px 20px;
    }

    /* ===== FILTER SECTION ===== */
    .filter-section {
      max-width: 1200px;
      margin: 0 auto 40px;
    }

    .filter-section h3 { color: #fff; font-size: 20px; font-weight: 700; margin: 0 0 16px; }

    .filter-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 15px;
    }

    .filter-buttons button {
      padding: 8px 18px;
      border: 2px solid #7f1d1d;
      background: rgba(20,5,5,0.7);
      backdrop-filter: blur(6px);
      color: #f87171;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s;
    }

    .filter-buttons button.active,
    .filter-buttons button:hover {
      background: #e11d48;
      color: #fff;
      border-color: #e11d48;
    }

    /* ===== MOVIE GRID ===== */
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .movie-card {
      background: rgba(20,8,8,0.88);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      border: 1.5px solid #2d0a0a;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .movie-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 20px 50px rgba(225,29,72,0.28);
      border-color: #e11d48;
    }

    .movie-image {
      position: relative;
      width: 100%;
      height: 360px;
      background: #0a0a0a;
      overflow: hidden;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: transform 0.4s ease;
    }

    .movie-card:hover .placeholder {
      transform: scale(1.04);
    }

    .rating {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #e11d48;
      padding: 6px 10px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 13px;
      color: #fff;
    }

    .movie-info { padding: 20px; flex: 1; display: flex; flex-direction: column; }

    .movie-info h3 { margin: 0 0 8px; color: #fff; font-size: 18px; font-weight: 700; }

    .genre   { color: #9ca3af; margin: 5px 0; font-size: 14px; }
    .language { color: #6b7280; margin: 3px 0; font-size: 13px; }
    .director { color: #6b7280; margin: 5px 0 10px; font-size: 13px; flex-grow: 1; }

    .shows-count { margin: 10px 0; }

    .badge {
      display: inline-block;
      background: rgba(225,29,72,0.15);
      color: #f43f5e;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      border: 1px solid #7f1d1d;
    }

    .book-btn {
      background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: bold;
      margin-top: auto;
      transition: opacity 0.3s, transform 0.2s;
    }

    .book-btn:hover { opacity: 0.9; transform: translateY(-1px); }

    .no-movies { grid-column: 1 / -1; text-align: center; color: #f43f5e; padding: 40px; }

    @media (max-width: 768px) {
      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies = signal<Movie[]>([]);
  selectedGenre = signal<string>('All');
  genres: string[] = ['All'];

  private allMovies: Movie[] = [];

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies().subscribe(movies => {
      this.allMovies = movies;
      this.movies.set(movies);
      // Dynamically build genre list from actual movie data
      const genreSet = new Set<string>();
      movies.forEach(m => {
        m.genre.split('/').forEach(g => genreSet.add(g.trim()));
      });
      this.genres = ['All', ...Array.from(genreSet).sort()];
    });
  }

  filterByGenre(genre: string) {
    this.selectedGenre.set(genre);
    if (genre === 'All') {
      this.movies.set(this.allMovies);
    } else {
      this.movies.set(this.allMovies.filter(m => m.genre.includes(genre)));
    }
  }
}
