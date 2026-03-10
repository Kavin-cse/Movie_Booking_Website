# 🚀 Quick Start Guide

## Installation (2 minutes)

```bash
# Navigate to project directory
cd "c:\Users\nithe\OneDrive\Documents\L&T pro-2\movie-ticket-booking"

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4200` in your browser.

## What You Get

### Out of the Box
✅ **5 Complete Components** with advanced features  
✅ **3 Services** for movie, seat, and booking management  
✅ **Responsive Design** working on all devices  
✅ **Form Validation** with real-time feedback  
✅ **State Management** using signals and observables  
✅ **Routing** with progress tracking  
✅ **Modern UI** with gradients and animations  

### Production Ready
- TypeScript strict mode enabled
- Memory leak prevention (proper cleanup)
- RxJS best practices implemented
- Type-safe throughout
- Accessibility features included
- Mobile-first responsive design

## Project Files

```
📁 src/
  ├── 📄 main.ts (Application bootstrap & routing)
  ├── 📄 services.ts (Movie, Seat, Booking services)
  ├── 📄 models.ts (TypeScript interfaces)
  │
  └── 📁 components/
      ├── 📄 movie-list.component.ts (Browse movies)
      ├── 📄 movie-detail.component.ts (Movie details)
      ├── 📄 booking.component.ts (Seat selection)
      ├── 📄 payment.component.ts (Payment form)
      └── 📄 confirmation.component.ts (Booking confirmation)

📄 index.html (Main HTML)
📄 package.json (Dependencies)
📄 tsconfig.json (TypeScript config)
📄 angular.json (Build config)
📄 README.md (Full documentation)
📄 ADVANCED_GUIDE.md (Technical details)
📄 PROJECT_SUMMARY.md (Overview)
```

## Feature Walkthrough

### 1️⃣ Movie Listing Page
- Browse all available movies
- Filter by genre (All, Sci-Fi, Adventure, Action)
- See ratings, duration, and show count
- Click any movie to view details

### 2️⃣ Movie Details Page
- Full movie information (cast, director, duration)
- Multiple show times with availability
- Different formats (2D/3D)
- Click show time and "Proceed to Seat Selection"

### 3️⃣ Seat Selection Page
- Interactive 72-seat cinema layout
- Three seat categories with different prices
- Real-time price calculation
- View price breakdown by category
- Select multiple seats and proceed to payment

### 4️⃣ Payment Page
- Choose payment method (Card, UPI, Wallet)
- Fill customer information
- Fill payment-specific details
- See real-time order summary
- Accept terms and complete payment

### 5️⃣ Confirmation Page
- See booking reference number
- View selected seats
- Confirm amount paid
- Important booking information
- Download or email ticket

## Key Technologies

| Technology | Purpose |
|-----------|---------|
| **Angular 17** | Frontend framework |
| **TypeScript** | Type-safe code |
| **RxJS** | Async operations |
| **CSS3** | Styling (Grid, Flexbox, Gradients) |
| **Signals** | State management |

## Pricing Structure

| Category | Price |
|----------|-------|
| Regular | ₹150 |
| Premium | ₹200 |
| VIP | ₹250 |
| **Taxes** | 18% GST |
| **Discount** | ₹50/seat (order > ₹1000) |

## Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (adaptive)
- **Desktop**: > 1024px (full layout)

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests (when configured)
npm test
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change Movie Data
Edit `src/services.ts` - `MovieService.movies` array

### Change Seat Layout
Edit `src/components/booking.component.ts` - `generateSeats()` method

### Change Colors
Edit component `styles` array for color values

### Change Pricing
Edit `src/services.ts` - Seat price values

## Troubleshooting

### Port Already in Use
```bash
# Use different port
ng serve --port 4300
```

### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### TypeScript Errors
Make sure your TypeScript version is 5.2+:
```bash
npm list typescript
```

## Next Steps

1. **Run the Application**
   ```bash
   npm run dev
   ```

2. **Test the Flow**
   - Select a movie
   - Choose a show time
   - Select seats
   - Fill payment details
   - Confirm booking

3. **Explore the Code**
   - Read through components
   - Check ADVANCED_GUIDE.md for patterns
   - Study service implementations

4. **Customize**
   - Add more movies
   - Modify styling
   - Add new features
   - Integrate with backend

## Production Deployment

### Build
```bash
npm run build
```

Output: `dist/movie-ticket-booking/`

### Deploy
- Upload to web server
- Configure backend API endpoints
- Set up payment gateway
- Add authentication
- Configure HTTPS

## Documentation

- **README.md** - Complete feature documentation
- **ADVANCED_GUIDE.md** - Advanced patterns and architecture
- **PROJECT_SUMMARY.md** - Project overview
- **QUICK_START.md** - This file

## Getting Help

1. Check the documentation files
2. Review inline code comments
3. Check Angular official documentation
4. Review component implementations

## Performance Tips

✅ **For Production**
- Run production build: `npm run build`
- Enable gzip compression
- Use CDN for assets
- Enable browser caching
- Monitor Core Web Vitals

✅ **For Development**
- Use source maps for debugging
- Check console for errors
- Use React DevTools (if needed)
- Monitor network requests

## File Size Reference

- **HTML**: ~800 lines
- **TypeScript**: ~1,900 lines
- **CSS**: ~1,200 lines
- **Total**: ~3,900 lines of code

## License

This project is open source and available for educational and commercial use.

---

**Happy Coding! 🎬🎉**

For more information, see:
- [README.md](README.md) - Complete documentation
- [ADVANCED_GUIDE.md](ADVANCED_GUIDE.md) - Technical details
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview
