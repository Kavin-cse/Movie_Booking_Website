import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, throwError } from 'rxjs';
import { Movie, ShowTime, Seat, Booking, BookingRequest, User, AuthState } from './models';

/* ==================== MOVIE SERVICE ==================== */
@Injectable({ providedIn: 'root' })
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'Fighter',
      genre: 'Action',
      rating: 7.5,
      duration: 166,
      releaseDate: '2024-01-25',
      language: 'Hindi',
      description: 'India\'s first aerial action film following the brave pilots of the Indian Air Force as they battle against terrorism and protect the nation.',
      posterUrl: '/Images/Fighter_film_teaser.jpg',
      director: 'Siddharth Anand',
      cast: ['Hrithik Roshan', 'Deepika Padukone', 'Anil Kapoor'],
      showTimes: [
        { id: '1-1', time: '10:00 AM', format: '2D', language: 'Hindi', availableSeats: 45, totalSeats: 72 },
        { id: '1-2', time: '2:00 PM', format: '3D', language: 'Hindi', availableSeats: 20, totalSeats: 72 },
        { id: '1-3', time: '7:00 PM', format: 'IMAX', language: 'Hindi', availableSeats: 8, totalSeats: 72 }
      ]
    },
    {
      id: 2,
      title: 'Jailer',
      genre: 'Action',
      rating: 7.8,
      duration: 168,
      releaseDate: '2023-08-10',
      language: 'Tamil',
      description: 'A retired jailer sets out on a mission to track down his son\'s murderer, only to discover a dangerous criminal organization behind the act.',
      posterUrl: '/Images/Jailer_2023_Tamil_film_poster.jpg',
      director: 'Nelson Dilipkumar',
      cast: ['Rajinikanth', 'Mohanlal', 'Jackie Shroff', 'Tamannaah'],
      showTimes: [
        { id: '2-1', time: '11:00 AM', format: '2D', language: 'Tamil', availableSeats: 30, totalSeats: 72 },
        { id: '2-2', time: '3:30 PM', format: '2D', language: 'Telugu', availableSeats: 25, totalSeats: 72 },
        { id: '2-3', time: '9:00 PM', format: '2D', language: 'Hindi', availableSeats: 5, totalSeats: 72 }
      ]
    },
    {
      id: 3,
      title: 'Kantara',
      genre: 'Action / Drama',
      rating: 9.0,
      duration: 148,
      releaseDate: '2022-09-30',
      language: 'Kannada',
      description: 'A tale of a unique land where humans co-exist with God. Set in the forests of coastal Karnataka, a man defends the land of his village and its traditions while battling against a forest officer.',
      posterUrl: '/Images/Kantara_-_A_Legend_Poster.webp',
      director: 'Rishab Shetty',
      cast: ['Rishab Shetty', 'Sapthami Gowda', 'Kishore'],
      showTimes: [
        { id: '3-1', time: '12:00 PM', format: '2D', language: 'Kannada', availableSeats: 50, totalSeats: 72 },
        { id: '3-2', time: '5:00 PM', format: '2D', language: 'Hindi', availableSeats: 18, totalSeats: 72 },
        { id: '3-3', time: '10:00 PM', format: '2D', language: 'Telugu', availableSeats: 3, totalSeats: 72 }
      ]
    },
    {
      id: 4,
      title: 'Kalki 2898 AD',
      genre: 'Sci-Fi / Action',
      rating: 8.0,
      duration: 181,
      releaseDate: '2024-06-27',
      language: 'Telugu',
      description: 'Set in a dystopian future of 2898 AD, the story interweaves Hindu mythology with futuristic sci-fi as the story of Kalki, the prophesied tenth avatar of Vishnu, unfolds.',
      posterUrl: '/Images/kalki.webp',
      director: 'Nag Ashwin',
      cast: ['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan', 'Kamal Haasan'],
      showTimes: [
        { id: '4-1', time: '10:30 AM', format: '2D', language: 'Telugu', availableSeats: 40, totalSeats: 72 },
        { id: '4-2', time: '2:30 PM', format: '3D', language: 'Hindi', availableSeats: 15, totalSeats: 72 },
        { id: '4-3', time: '7:30 PM', format: 'IMAX', language: 'Telugu', availableSeats: 10, totalSeats: 72 }
      ]
    },
    {
      id: 5,
      title: 'Leo',
      genre: 'Action / Thriller',
      rating: 7.6,
      duration: 164,
      releaseDate: '2023-10-19',
      language: 'Tamil',
      description: 'A mild-mannered cafe owner is forced to confront his violent past when his family is threatened by a dangerous drug cartel.',
      posterUrl: '/Images/leo.png',
      director: 'Lokesh Kanagaraj',
      cast: ['Vijay', 'Sanjay Dutt', 'Trisha Krishnan', 'Anurag Kashyap'],
      showTimes: [
        { id: '5-1', time: '9:30 AM', format: '2D', language: 'Tamil', availableSeats: 35, totalSeats: 72 },
        { id: '5-2', time: '1:00 PM', format: '2D', language: 'Telugu', availableSeats: 22, totalSeats: 72 },
        { id: '5-3', time: '6:30 PM', format: '2D', language: 'Hindi', availableSeats: 12, totalSeats: 72 }
      ]
    },
    {
      id: 6,
      title: 'Salaar',
      genre: 'Action',
      rating: 7.4,
      duration: 176,
      releaseDate: '2023-12-22',
      language: 'Telugu',
      description: 'A ferocious, ruthless man who is feared by all but is bound by his promise to a dying friend — a promise that tests his loyalty and changes the course of an entire kingdom.',
      posterUrl: '/Images/salaar_kn6q8vp1.jpg',
      director: 'Prashanth Neel',
      cast: ['Prabhas', 'Prithviraj Sukumaran', 'Shruti Haasan'],
      showTimes: [
        { id: '6-1', time: '11:30 AM', format: '2D', language: 'Telugu', availableSeats: 28, totalSeats: 72 },
        { id: '6-2', time: '4:00 PM', format: '2D', language: 'Hindi', availableSeats: 16, totalSeats: 72 },
        { id: '6-3', time: '8:30 PM', format: '2D', language: 'Kannada', availableSeats: 7, totalSeats: 72 }
      ]
    },
    {
      id: 7,
      title: 'Aadu 3',
      genre: 'Comedy / Action',
      rating: 7.2,
      duration: 142,
      releaseDate: '2024-03-28',
      language: 'Malayalam',
      description: 'The beloved gang of Shaji Pappan is back for a third outrageous adventure filled with laugh-out-loud comedy, crazy action and unexpected twists that keep you on the edge of your seat.',
      posterUrl: '/Images/aadu3.webp',
      director: 'Midhun Manuel Thomas',
      cast: ['Jayasurya', 'Vinayakan', 'Sunny Wayne', 'Bhavana'],
      showTimes: [
        { id: '7-1', time: '10:00 AM', format: '2D', language: 'Malayalam', availableSeats: 40, totalSeats: 72 },
        { id: '7-2', time: '1:30 PM', format: '2D', language: 'Tamil', availableSeats: 22, totalSeats: 72 },
        { id: '7-3', time: '7:00 PM', format: '2D', language: 'Malayalam', availableSeats: 14, totalSeats: 72 }
      ]
    },
    {
      id: 8,
      title: 'Avengers: Endgame',
      genre: 'Action / Sci-Fi',
      rating: 8.4,
      duration: 181,
      releaseDate: '2019-04-26',
      language: 'English',
      description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\'s actions and restore balance to the universe in an epic final battle.',
      posterUrl: '/Images/avengers.jpeg',
      director: 'Anthony & Joe Russo',
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
      showTimes: [
        { id: '8-1', time: '11:00 AM', format: '2D', language: 'English', availableSeats: 38, totalSeats: 72 },
        { id: '8-2', time: '3:00 PM', format: '3D', language: 'English', availableSeats: 10, totalSeats: 72 },
        { id: '8-3', time: '8:00 PM', format: 'IMAX', language: 'English', availableSeats: 5, totalSeats: 72 }
      ]
    }
  ];

  getMovies(): Observable<Movie[]> {
    return of(this.movies).pipe(delay(500));
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(m => m.id === id)).pipe(delay(300));
  }

  getMoviesByGenre(genre: string): Observable<Movie[]> {
    return of(this.movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase())).pipe(delay(400));
  }
}

/* ==================== SEAT SERVICE ==================== */
@Injectable({ providedIn: 'root' })
export class SeatService {
  private seatsSubject = new BehaviorSubject<Seat[]>([]);

  initializeSeats(showTimeId: string): Observable<Seat[]> {
    const seats = this.generateSeats();
    this.seatsSubject.next(seats);
    return of(seats).pipe(delay(200));
  }

  getSeats(): Observable<Seat[]> {
    return this.seatsSubject.asObservable();
  }

  private generateSeats(): Seat[] {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 12;

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const category = i <= 4 ? 'vip' : i <= 8 ? 'premium' : 'regular';
        const price = category === 'vip' ? 250 : category === 'premium' ? 200 : 150;
        
        seats.push({
          id: `${row}${i}`,
          seatNo: `${row}${i}`,
          row,
          column: i,
          isAvailable: Math.random() > 0.25,
          isSelected: false,
          price,
          category
        });
      }
    });

    return seats;
  }

  selectSeat(seatId: string): void {
    const seats = this.seatsSubject.value;
    const seat = seats.find(s => s.id === seatId);
    if (seat && seat.isAvailable) {
      seat.isSelected = !seat.isSelected;
      this.seatsSubject.next([...seats]);
    }
  }

  getSelectedSeats(): Seat[] {
    return this.seatsSubject.value.filter(s => s.isSelected);
  }

  resetSeats(): void {
    this.seatsSubject.next([]);
  }
}

/* ==================== BOOKING SERVICE ==================== */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  private nextBookingId = 1000;

  createBooking(request: BookingRequest, seats: Seat[], movie: Movie): Observable<Booking> {
    const booking: Booking = {
      id: `BK${this.nextBookingId++}`,
      movieId: request.movieId,
      movieTitle: movie.title,
      showTimeId: request.showTimeId,
      selectedSeats: seats,
      totalPrice: seats.reduce((sum, seat) => sum + seat.price, 0),
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      bookingDate: new Date(),
      status: 'confirmed',
      paymentMethod: request.paymentMethod
    };

    const bookings = this.bookingsSubject.value;
    bookings.push(booking);
    this.bookingsSubject.next(bookings);

    return of(booking).pipe(delay(1000));
  }

  getBookings(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }

  getBookingById(id: string): Observable<Booking | undefined> {
    return of(this.bookingsSubject.value.find(b => b.id === id)).pipe(delay(200));
  }

  cancelBooking(id: string): Observable<boolean> {
    const bookings = this.bookingsSubject.value;
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'cancelled';
      this.bookingsSubject.next([...bookings]);
      return of(true).pipe(delay(800));
    }
    return of(false);
  }
}

/* ==================== AUTH SERVICE ==================== */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'cinema_users';
  private readonly SESSION_KEY = 'cinema_session';

  private authStateSubject = new BehaviorSubject<AuthState>(this.restoreSession());
  authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.seedDemoUser();
  }

  // ---- Helpers ----
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  private generateId(): string {
    return 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private restoreSession(): AuthState {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw) as AuthState;
      // Verify user still exists
      const users = this.getUsers();
      if (session.user && users.some(u => u.id === session.user!.id)) {
        return session;
      }
    }
    return { isLoggedIn: false, user: null, token: null };
  }

  private persistSession(state: AuthState): void {
    if (state.isLoggedIn) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  private seedDemoUser(): void {
    const users = this.getUsers();
    if (!users.some(u => u.email === 'demo@cinema.com')) {
      const demo: User = {
        id: 'usr_demo001',
        fullName: 'Demo User',
        email: 'demo@cinema.com',
        phone: '9876543210',
        passwordHash: this.simpleHash('Demo@1234'),
        createdAt: new Date(),
        avatar: 'DU'
      };
      users.push(demo);
      this.saveUsers(users);
    }
  }

  // ---- Public API ----
  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  get isLoggedIn(): boolean {
    return this.authStateSubject.value.isLoggedIn;
  }

  register(fullName: string, email: string, phone: string, password: string): Observable<User> {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return throwError(() => new Error('An account with this email already exists.'));
    }
    const newUser: User = {
      id: this.generateId(),
      fullName,
      email,
      phone,
      passwordHash: this.simpleHash(password),
      createdAt: new Date(),
      avatar: this.getInitials(fullName)
    };
    users.push(newUser);
    this.saveUsers(users);
    const token = this.simpleHash(newUser.id + Date.now());
    const state: AuthState = { isLoggedIn: true, user: newUser, token };
    this.authStateSubject.next(state);
    this.persistSession(state);
    return of(newUser).pipe(delay(800));
  }

  login(email: string, password: string): Observable<User> {
    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() &&
           u.passwordHash === this.simpleHash(password)
    );
    if (!user) {
      return throwError(() => new Error('Invalid email or password. Please try again.'));
    }
    const token = this.simpleHash(user.id + Date.now());
    const state: AuthState = { isLoggedIn: true, user, token };
    this.authStateSubject.next(state);
    this.persistSession(state);
    return of(user).pipe(delay(800));
  }

  logout(): void {
    const state: AuthState = { isLoggedIn: false, user: null, token: null };
    this.authStateSubject.next(state);
    this.persistSession(state);
  }
}
