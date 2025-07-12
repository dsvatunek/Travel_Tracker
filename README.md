# Travel Tracker

A private web application for tracking your personal flights, travel history, and visited locations with an interactive map and timeline.

## Features

- 🛫 **Flight Tracking**: Log detailed flight information including flight number, airline, aircraft type, seat, class, and more
- 🗺️ **Interactive Map**: View your flights on a world map with airport markers and flight paths
- 📅 **Timeline**: Filter flights by date range and see your travel history chronologically
- 🎯 **Admin Panel**: Easy-to-use interface for adding new flights
- 📊 **Statistics**: Track total flights, airports visited, and countries explored
- 🖼️ **Photo Support**: Add photos to your flights (coming soon)
- 🌍 **Country/City Tracking**: Track countries and cities visited (coming soon)

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Maps**: React Leaflet with OpenStreetMap tiles
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Adding Flights

1. Click the **+** button in the bottom right corner
2. Fill in the flight details:
   - Flight number (optional)
   - Airline name
   - Airport codes (e.g., LAX, JFK)
   - Departure/arrival times
   - Seat, class, aircraft type
   - Reason for travel
   - Comments

### Viewing Your Travel Data

- **Map View**: Toggle flight paths, airports, and countries
- **Timeline**: Use date range picker to filter flights
- **Statistics**: View your travel stats at the top of the page

### Supported Airport Codes

Currently supports major international airports:
- LAX (Los Angeles)
- JFK (New York)
- LHR (London Heathrow)
- NRT (Tokyo Narita)
- CDG (Paris Charles de Gaulle)
- SIN (Singapore Changi)
- DXB (Dubai)
- SYD (Sydney)
- YYZ (Toronto)
- FRA (Frankfurt)

## Database Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run db:seed` - Seed database with airport data

## File Structure

```
├── src/
│   ├── app/
│   │   ├── api/flights/       # Flight API endpoints
│   │   └── page.tsx           # Main application page
│   ├── components/
│   │   ├── AdminPanel.tsx     # Flight entry form
│   │   ├── MapView.tsx        # Interactive map component
│   │   └── Timeline.tsx       # Timeline component
│   ├── lib/
│   │   └── db.ts             # Database connection
│   └── generated/
│       └── prisma/           # Generated Prisma client
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   └── seed.ts              # Database seeding script
└── dev.db                   # SQLite database file
```

## Privacy

This application is designed to run locally on your PC. All data is stored in a local SQLite database and never leaves your machine unless you explicitly choose to deploy it elsewhere.

## Future Enhancements

- [ ] Photo upload and gallery
- [ ] City tracking for road trips
- [ ] Travel statistics and analytics
- [ ] Export data functionality
- [ ] Mobile responsive design improvements
- [ ] Dark mode support
- [ ] Integration with airline APIs for automatic flight data
- [ ] Trip planning features
