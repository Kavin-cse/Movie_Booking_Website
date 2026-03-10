# Architecture & Flow Diagrams

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AppComponent                           │
│                    (Root Component)                          │
│  - Header with title                                        │
│  - Router outlet                                            │
│  - Footer                                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
    ┌───────────────┐         ┌──────────────────────┐
    │   Router      │         │  Services Layer      │
    │   (Routes)    │         │                      │
    │               │         │  - MovieService     │
    │  1. /         │         │  - SeatService      │
    │  2. /movie/:id│         │  - BookingService   │
    │  3. /booking  │         │                      │
    │  4. /payment  │         │  Observable-based    │
    │  5. /confirm  │         │  State Management    │
    └───────────────┘         └──────────────────────┘
        │
        ├────────────────────┬─────────────────┬──────────────┬──────────────┐
        │                    │                 │              │              │
        ▼                    ▼                 ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌───────────┐
    │   Movies     │ │Movie Detail  │ │  Booking   │ │ Payment  │ │Confirm    │
    │   Component  │ │  Component   │ │ Component  │ │Component │ │Component  │
    │              │ │              │ │            │ │          │ │           │
    │ - Filter     │ │ - Details    │ │ - Select   │ │- Form    │ │- Summary  │
    │ - Grid       │ │ - ShowTimes  │ │   Seats    │ │- Validate│ │- Ticket   │
    │ - Cards      │ │ - Director   │ │ - Price    │ │- Methods │ │- Actions  │
    │              │ │ - Cast       │ │ - Summary  │ │- Payment │ │           │
    └──────────────┘ └──────────────┘ └────────────┘ └──────────┘ └───────────┘
```

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Component State                               │
│                                                                       │
│  Movies List        Movie Details      Booking              Payment  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────┐       ┌────────┐│
│  │ movies[]     │   │ movie        │   │ seats[]  │       │form    ││
│  │ selectedGenre│   │selectedShow  │   │selected []       │data    ││
│  └──────────────┘   └──────────────┘   │totalPrice│       └────────┘│
└─────────────────────────────────────────────────────────────────────┘
        │                   │                   │              │
        │                   │                   │              │
        ▼                   ▼                   ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Services Layer                                │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ MovieService     │  │ SeatService      │  │ BookingService  │  │
│  │                  │  │                  │  │                 │  │
│  │ getMovies()      │  │initializeSeats() │  │createBooking()  │  │
│  │ getMovieById()   │  │selectSeat()      │  │getBooking()     │  │
│  │ getByGenre()     │  │getSelectedSeats()│  │cancelBooking()  │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
        │                   │                      │
        │                   │                      │
        ▼                   ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Observable Streams (RxJS)                      │
│                                                                       │
│  Observable<Movie[]>    BehaviorSubject<Seat[]>  Observable<Booking>│
│  with delay(500)        with state updates       with delay(1000)   │
│                                                                       │
│  Provides:              Provides:                Provides:           │
│  - All movies           - Seat grid              - Confirmation      │
│  - Single movie         - Selection state        - Booking ID        │
│  - Filtered list        - Availability          - Receipt data      │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔄 User Journey Flow

```
START
  │
  ▼
┌─────────────────────────────┐
│ MovieListComponent          │
│ - Display all movies        │
│ - Filter by genre           │
│ - Show ratings & details    │
└────────┬────────────────────┘
         │ Click "Book Tickets"
         │
         ▼
┌─────────────────────────────┐
│ MovieDetailComponent        │
│ - Full movie info           │
│ - Cast & director           │
│ - Select show time          │
└────────┬────────────────────┘
         │ Click "Proceed to Seat Selection"
         │
         ▼
┌─────────────────────────────┐
│ BookingComponent            │
│ - Interactive seat grid     │
│ - Select multiple seats     │
│ - View price breakdown      │
└────────┬────────────────────┘
         │ Click "Proceed to Payment"
         │
         ▼
┌─────────────────────────────┐
│ PaymentComponent            │
│ - Fill customer info        │
│ - Choose payment method     │
│ - Enter payment details     │
│ - Validate form             │
└────────┬────────────────────┘
         │ Click "Complete Payment"
         │ (2 second processing)
         │
         ▼
┌─────────────────────────────┐
│ ConfirmationComponent       │
│ - Show booking reference    │
│ - Display ticket preview    │
│ - Option to download/email  │
└────────┬────────────────────┘
         │ Click "Back to Home"
         │
         ▼
         END
```

## 🎬 Component Dependency Graph

```
                     AppComponent
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    MovieList      MovieDetail          Booking
    Component      Component            Component
        │               │                   │
        │               │                   │
        │    ┌──────────┴───────────┐      │
        │    │                      │      │
        │    ▼                      ▼      ▼
        └─→ MovieService ←─────────────→ SeatService
            (getMovies,             (initializeSeats,
             getMovieById,           selectSeat,
             getByGenre)             getSeats)
                │                        │
                │                        │
                └────────────┬───────────┘
                             │
                             ▼
                      BookingService
                    (createBooking,
                     getBooking,
                     cancelBooking)
```

## 🔐 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Signals (Local State)                     │
│                                                               │
│  MovieListComponent              BookingComponent            │
│  ┌──────────────────┐            ┌────────────────────┐    │
│  │ movies           │            │ seats              │    │
│  │ selectedGenre    │            │ selectedSeats      │    │
│  └──────────────────┘            │ (computed)         │    │
│                                  │ totalPrice         │    │
│                                  │ (computed)         │    │
│  MovieDetailComponent             │ categoryBreakdown  │    │
│  ┌──────────────────┐            │ (computed)         │    │
│  │ movie            │            └────────────────────┘    │
│  │ selectedShowTime │                                      │
│  └──────────────────┘            PaymentComponent         │
│                                  ┌────────────────────┐    │
│                                  │ paymentForm        │    │
│                                  │ isProcessing       │    │
│                                  └────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
          │
          │  Updates via
          │  setter/signal.set()
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│              BehaviorSubject (Shared State)                  │
│                                                               │
│  MovieService                   SeatService                 │
│  ┌──────────────────┐           ┌────────────────────┐     │
│  │ movies$          │           │ seatsSubject$      │     │
│  │ (static data)    │           │ (dynamic state)    │     │
│  └──────────────────┘           └────────────────────┘     │
│                                                               │
│                      BookingService                         │
│                      ┌────────────────────┐                 │
│                      │ bookingsSubject$   │                 │
│                      │ (booking history)  │                 │
│                      └────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Responsive Layout Flow

```
DESKTOP (> 1024px)
┌──────────────────────────────────────────────┐
│  Header                                      │
├───────────────────┬──────────────────────────┤
│                   │                          │
│  Main Content     │    Sticky Summary        │
│  (flex: 1)        │    (width: 350px)        │
│                   │                          │
└───────────────────┴──────────────────────────┘

TABLET (768px - 1024px)
┌──────────────────────────────────────────────┐
│  Header                                      │
├──────────────────────────────────────────────┤
│  Main Content (full width)                   │
│                                              │
│  Summary (full width below)                  │
│                                              │
└──────────────────────────────────────────────┘

MOBILE (< 768px)
┌──────────────────────┐
│  Header              │
├──────────────────────┤
│ Main Content         │
│ (single column)      │
│                      │
│ Summary              │
│ (stacked below)      │
│                      │
└──────────────────────┘
```

## 🎯 Form Validation Flow

```
PaymentComponent
      │
      ▼
┌───────────────────────────┐
│ User Input                │
│ - Full Name               │
│ - Email                   │
│ - Phone                   │
│ - Payment Method          │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────┐
│ Form Validation                                           │
│                                                           │
│  If method === 'card'                                     │
│  │                                                         │
│  ├─ Validators for cardNumber (16 digits)                │
│  ├─ Validators for expiry (MM/YY)                        │
│  └─ Validators for cvv (3 digits)                        │
│                                                           │
│  If method === 'upi'                                      │
│  │                                                         │
│  └─ Validators for upiId (pattern match)                 │
│                                                           │
│  If method === 'wallet'                                   │
│  │                                                         │
│  └─ Validators for walletPhone (10 digits)               │
│                                                           │
└───────────────┬───────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │ Validation Result      │
    │                        │
    │ ✅ Form Valid ──────→ Enable Submit
    │ ❌ Form Invalid ────→ Disable Submit
    │                        │
    │ Show Errors:           │
    │ - "Email required"     │
    │ - "Phone invalid"      │
    │ - "Card required"      │
    └───────────────────────┘
```

## 💰 Price Calculation Flow

```
┌─────────────────┐
│ Selected Seats  │  ┌────────────────────────────┐
│                 │  │ Seat Price Breakdown:      │
│ A1 - Regular    │→ │ - Regular: ₹150 × count    │
│ A2 - VIP        │  │ - Premium: ₹200 × count    │
│ B3 - Premium    │  │ - VIP: ₹250 × count        │
└─────────────────┘  └────────────┬───────────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │ Subtotal ₹XXX  │
                         └────────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                        │
                    ▼                        ▼
        ┌──────────────────┐        ┌──────────────────┐
        │ Tax (18% GST)    │        │ Discount Logic   │
        │ Subtotal × 0.18  │        │                  │
        │ = ₹XX            │        │ If Subtotal > ₹  │
        └──────────────────┘        │ 1000 then        │
                                    │ Discount = ₹50   │
                                    │ × seat count     │
                                    └────────┬─────────┘
                                             │
                                    ┌────────▼──────────┐
                                    │ Final Amount      │
                                    │ Subtotal +        │
                                    │ Tax - Discount    │
                                    │ = ₹XXXX           │
                                    └───────────────────┘
```

## 🔄 Subscription Cleanup Pattern

```
Component Lifecycle
│
├─ ngOnInit()
│  │
│  └─ this.service.getData()
│     │
│     └─.pipe(takeUntil(this.destroy$))
│       │
│       └─.subscribe(data => {
│           // Handle data
│         })
│
├─ Component Active (mounted)
│  │
│  ├─ Data received
│  ├─ User interactions
│  └─ State updates
│
├─ ngOnDestroy()
│  │
│  └─ this.destroy$.next()
│     this.destroy$.complete()
│     │
│     └─ All subscriptions cleaned up
│        (Memory leak prevented)
│
└─ Component Removed
```

## 🎨 Styling Architecture

```
┌─────────────────────────────────────────────────┐
│           Global Styles (index.html)            │
│                                                  │
│ - HTML/Body baseline                           │
│ - Font family                                  │
│ - Color variables ready                        │
└─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────┐
│        Component-Scoped Styles (CSS)            │
│                                                  │
│ Each component has its own:                    │
│ - Color scheme                                 │
│ - Layout (Grid/Flexbox)                        │
│ - Animations                                   │
│ - Responsive breakpoints                       │
└─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────┐
│          View Encapsulation                     │
│                                                  │
│ - No style conflicts                           │
│ - No global pollution                          │
│ - Easy to maintain and update                  │
└─────────────────────────────────────────────────┘
```

---

**This diagram demonstrates the complete architecture, data flow, and component relationships of the Movie Ticket Booking application.**
