import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter, Routes, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MovieListComponent }   from './components/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail.component';
import { BookingComponent }     from './components/booking.component';
import { PaymentComponent }     from './components/payment.component';
import { ConfirmationComponent } from './components/confirmation.component';
import { LoginComponent }       from './components/login.component';
import { RegisterComponent }    from './components/register.component';
import { NavbarComponent }      from './components/navbar.component';
import { authGuard }            from './guards/auth.guard';

/* ==================== ROUTES ==================== */
const routes: Routes = [
  { path: '',            component: MovieListComponent,   data: { title: 'Movies' } },
  { path: 'movie/:id',  component: MovieDetailComponent,  data: { title: 'Movie Details' } },
  { path: 'login',       component: LoginComponent,       data: { title: 'Sign In' } },
  { path: 'register',   component: RegisterComponent,     data: { title: 'Create Account' } },

  // Protected routes — require authentication
  { path: 'booking',      component: BookingComponent,      canActivate: [authGuard], data: { title: 'Select Seats' } },
  { path: 'payment',      component: PaymentComponent,      canActivate: [authGuard], data: { title: 'Payment' } },
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [authGuard], data: { title: 'Confirmation' } },

  { path: '**', redirectTo: '' }
];

/* ==================== ROOT COMPONENT ==================== */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <p>&copy; 2024 Cinema Palace. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main { flex: 1; }

    footer {
      background: rgba(15,12,41,0.95);
      color: rgba(255,255,255,0.35);
      text-align: center;
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 13px;
    }
  `]
})
class AppComponent {}

/* ==================== BOOTSTRAP ==================== */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));
