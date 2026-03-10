/* ==================== MODELS & TYPES ==================== */

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: Date;
  avatar: string; // initials-based
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export interface Seat {
  id: string;
  seatNo: string;
  row: string;
  column: number;
  isAvailable: boolean;
  isSelected: boolean;
  price: number;
  category: 'regular' | 'premium' | 'vip';
}

export interface ShowTime {
  id: string;
  time: string;
  format: string;
  language: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  posterUrl: string;
  showTimes: ShowTime[];
  cast: string[];
  director: string;
}

export interface Booking {
  id: string;
  movieId: number;
  movieTitle: string;
  showTimeId: string;
  selectedSeats: Seat[];
  totalPrice: number;
  customerEmail: string;
  customerPhone: string;
  bookingDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentMethod: 'card' | 'upi' | 'wallet';
}

export interface BookingRequest {
  movieId: number;
  showTimeId: string;
  seats: string[];
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'card' | 'upi' | 'wallet';
}
