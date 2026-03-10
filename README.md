# Movie Ticket Booking Portal

An advanced, production-ready Angular application for booking movie tickets with a modern UI, complete payment integration, and best practices.

## 🌟 Features

### Core Features
- **Movie Listing**: Browse available movies with filters and detailed information
- **Movie Details**: View comprehensive movie information, cast, director, and show times
- **Seat Selection**: Interactive seat selection with real-time pricing and availability
- **Payment Processing**: Multiple payment methods (Card, UPI, Digital Wallet)
- **Booking Confirmation**: Detailed confirmation with booking reference and ticket download

### Advanced Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive client-side validation with error messages
- **State Management**: Using Angular signals for reactive state management
- **Type Safety**: Full TypeScript with strict type checking
- **RxJS Integration**: Advanced observable patterns with proper cleanup
- **Progress Tracking**: Visual progress indicators through booking flow
- **Price Breakdown**: Detailed pricing with taxes, discounts, and final amounts
- **Accessibility**: Semantic HTML and ARIA labels for better accessibility

### UI/UX Features
- **Modern Gradient Design**: Contemporary color scheme and animations
- **Smooth Transitions**: CSS transitions and Angular animations
- **Interactive Feedback**: Hover states and user feedback
- **Error Handling**: Clear error messages and validation feedback
- **Loading States**: Progress indicators and processing feedback

## 📁 Project Structure

```
movie-ticket-booking/
├── src/
│   ├── components/
│   │   ├── movie-list.component.ts      # Movie listing with filters
│   │   ├── movie-detail.component.ts    # Movie details and show time selection
│   │   ├── booking.component.ts         # Seat selection and booking
│   │   ├── payment.component.ts         # Payment form with validation
│   │   └── confirmation.component.ts    # Booking confirmation
│   ├── services.ts                      # Movie, Seat, and Booking services
│   ├── models.ts                        # TypeScript interfaces and types
│   └── main.ts                          # Application bootstrap and routing
├── index.html                           # Main HTML template
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Dependencies and scripts
└── README.md                            # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build

# Run tests
npm test
```

The application will be available at `http://localhost:4200`

## 🎯 Key Technologies

- **Angular 17**: Latest Angular framework with standalone components
- **TypeScript**: Strict type checking and modern language features
- **RxJS 7**: Reactive programming with observables
- **Angular Forms**: Reactive forms with advanced validation
- **CSS Grid & Flexbox**: Modern responsive layouts
- **Angular Router**: Client-side routing with lazy loading

## 📋 Component Details

### MovieListComponent
- Displays all available movies in a grid layout
- Filter by genre functionality
- Shows ratings, duration, and show time count
- Responsive grid that adapts to screen size

### MovieDetailComponent
- Full movie information including cast and director
- Show time selection with availability status
- Meta information badges
- Links to seat selection

### BookingComponent
- Interactive seat grid with visual feedback
- Seat categories (Regular, Premium, VIP) with different pricing
- Real-time price calculation
- Price breakdown by category
- Sticky summary panel

### PaymentComponent
- Multi-step form with dynamic validation
- Three payment methods (Card, UPI, Wallet)
- Conditional form fields based on payment method
- Tax and discount calculations
- Order summary with security information

### ConfirmationComponent
- Booking confirmation display
- Ticket preview
- Booking reference with copy functionality
- Important booking information
- Download and email ticket buttons

## 💳 Payment Methods

1. **Credit/Debit Card**
   - 16-digit card number
   - MM/YY expiry format
   - 3-digit CVV

2. **UPI**
   - UPI ID validation
   - Example: yourname@upi

3. **Digital Wallet**
   - Phone number validation
   - Linked wallet authentication

## 💰 Pricing

- **Regular Seats**: ₹150
- **Premium Seats**: ₹200
- **VIP Seats**: ₹250
- **Taxes**: 18% GST
- **Discount**: ₹50 per seat (for orders > ₹1000)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Alt text for images
- Form labels and error messages

## 🔒 Security Features

- Client-side form validation
- Sensitive data handling (card details)
- HTTPS ready
- Input sanitization
- CORS ready for backend integration

## 🔄 State Management

Uses Angular Signals for reactive state:
```typescript
const movies = signal<Movie[]>([]);
const selectedSeats = computed(() => seats().filter(s => s.isSelected));
const totalPrice = computed(() => selectedSeats().reduce((sum, s) => sum + s.price, 0));
```

## 📊 Data Models

### Movie
```typescript
interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  duration: number;
  language: string;
  description: string;
  cast: string[];
  director: string;
  showTimes: ShowTime[];
}
```

### Booking
```typescript
interface Booking {
  id: string;
  movieId: number;
  showTimeId: string;
  selectedSeats: Seat[];
  totalPrice: number;
  customerEmail: string;
  customerPhone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentMethod: 'card' | 'upi' | 'wallet';
}
```

## 🎨 Styling Approach

- Custom CSS with CSS variables
- No external UI framework for maximum customization
- Gradient backgrounds and modern aesthetics
- Mobile-first responsive design
- Smooth animations and transitions

## 🔌 Backend Integration

Services are ready for backend integration:

```typescript
// Example: Connect to real API
getMovies(): Observable<Movie[]> {
  return this.http.get<Movie[]>('/api/movies');
}

createBooking(request: BookingRequest): Observable<Booking> {
  return this.http.post<Booking>('/api/bookings', request);
}
```

## 🧪 Testing Ready

Services and components are designed for easy unit testing:
- Dependency injection for all services
- Observable-based data flow
- Computed properties for pure functions
- Testable validators and business logic

## 📈 Performance Optimization

- Standalone components (no module overhead)
- OnDestroy cleanup with takeUntil pattern
- Lazy validators in forms
- CSS-based animations (no JavaScript animations)
- Responsive images ready

## 🚀 Production Checklist

- [ ] Connect to real backend API
- [ ] Implement payment gateway (Razorpay, Stripe, PayU)
- [ ] Add user authentication
- [ ] Implement booking history
- [ ] Add email notifications
- [ ] Set up analytics tracking
- [ ] Configure HTTPS
- [ ] Add error logging service
- [ ] Implement rate limiting
- [ ] Add caching strategy

## 📞 Support

For issues and suggestions, please create an issue in the repository.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Angular 17**
