import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Major airports from around the world with accurate data
const airports = [
  // North America
  { icaoCode: 'KLAX', iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9425, longitude: -118.4081, altitude: 38 },
  { icaoCode: 'KJFK', iataCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781, altitude: 4 },
  { icaoCode: 'KORD', iataCode: 'ORD', name: 'Chicago O\'Hare International Airport', city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073, altitude: 201 },
  { icaoCode: 'KDEN', iataCode: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', latitude: 39.8561, longitude: -104.6737, altitude: 1655 },
  { icaoCode: 'KSFO', iataCode: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', latitude: 37.6213, longitude: -122.3790, altitude: 4 },
  { icaoCode: 'KIAH', iataCode: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States', latitude: 29.9902, longitude: -95.3368, altitude: 29 },
  { icaoCode: 'KATL', iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', latitude: 33.6407, longitude: -84.4277, altitude: 313 },
  { icaoCode: 'KMIA', iataCode: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.7933, longitude: -80.2906, altitude: 3 },
  { icaoCode: 'KBOS', iataCode: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States', latitude: 42.3656, longitude: -71.0096, altitude: 6 },
  { icaoCode: 'KSEA', iataCode: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', latitude: 47.4502, longitude: -122.3088, altitude: 131 },
  { icaoCode: 'CYYZ', iataCode: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248, altitude: 173 },
  { icaoCode: 'CYVR', iataCode: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', latitude: 49.1967, longitude: -123.1815, altitude: 4 },
  { icaoCode: 'CYUL', iataCode: 'YUL', name: 'Montreal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada', latitude: 45.4657, longitude: -73.7445, altitude: 36 },

  // Europe
  { icaoCode: 'EGLL', iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543, altitude: 25 },
  { icaoCode: 'EGKK', iataCode: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'United Kingdom', latitude: 51.1537, longitude: -0.1821, altitude: 62 },
  { icaoCode: 'LFPG', iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479, altitude: 119 },
  { icaoCode: 'LFPO', iataCode: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France', latitude: 48.7262, longitude: 2.3654, altitude: 89 },
  { icaoCode: 'EDDF', iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622, altitude: 111 },
  { icaoCode: 'EDDM', iataCode: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', latitude: 48.3538, longitude: 11.7861, altitude: 448 },
  { icaoCode: 'LEMD', iataCode: 'MAD', name: 'Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4719, longitude: -3.5626, altitude: 610 },
  { icaoCode: 'LEBL', iataCode: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', latitude: 41.2974, longitude: 2.0833, altitude: 4 },
  { icaoCode: 'LIRF', iataCode: 'FCO', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', latitude: 41.8045, longitude: 12.2508, altitude: 5 },
  { icaoCode: 'LIML', iataCode: 'LIN', name: 'Milan Linate Airport', city: 'Milan', country: 'Italy', latitude: 45.4454, longitude: 9.2767, altitude: 103 },
  { icaoCode: 'EHAM', iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683, altitude: -4 },
  { icaoCode: 'EKCH', iataCode: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.6181, longitude: 12.6561, altitude: 5 },
  { icaoCode: 'ESSA', iataCode: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', latitude: 59.6519, longitude: 17.9186, altitude: 42 },
  { icaoCode: 'ENGM', iataCode: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway', latitude: 60.1939, longitude: 11.1004, altitude: 202 },
  { icaoCode: 'EFHK', iataCode: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland', latitude: 60.3172, longitude: 24.9633, altitude: 55 },
  { icaoCode: 'UUEE', iataCode: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'Russia', latitude: 55.9726, longitude: 37.4146, altitude: 190 },

  // Asia
  { icaoCode: 'RJTT', iataCode: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', latitude: 35.7647, longitude: 140.3864, altitude: 43 },
  { icaoCode: 'RJAA', iataCode: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798, altitude: 6 },
  { icaoCode: 'RKSI', iataCode: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407, altitude: 7 },
  { icaoCode: 'ZBAA', iataCode: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', latitude: 40.0801, longitude: 116.5846, altitude: 35 },
  { icaoCode: 'ZSPD', iataCode: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', latitude: 31.1443, longitude: 121.8083, altitude: 4 },
  { icaoCode: 'VHHH', iataCode: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3080, longitude: 113.9185, altitude: 9 },
  { icaoCode: 'WSSS', iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915, altitude: 7 },
  { icaoCode: 'VTBS', iataCode: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.6900, longitude: 100.7501, altitude: 2 },
  { icaoCode: 'VOMM', iataCode: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', latitude: 12.9941, longitude: 80.1709, altitude: 16 },
  { icaoCode: 'VIDP', iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', latitude: 28.5665, longitude: 77.1031, altitude: 237 },
  { icaoCode: 'VABB', iataCode: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656, altitude: 11 },

  // Middle East
  { icaoCode: 'OMDB', iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657, altitude: 19 },
  { icaoCode: 'OOMS', iataCode: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', latitude: 23.5933, longitude: 58.2844, altitude: 14 },
  { icaoCode: 'OTHH', iataCode: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', latitude: 25.2731, longitude: 51.6086, altitude: 4 },
  { icaoCode: 'OERK', iataCode: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.9576, longitude: 46.6988, altitude: 614 },
  { icaoCode: 'LTBA', iataCode: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.2619, longitude: 28.7279, altitude: 99 },

  // Africa
  { icaoCode: 'FACT', iataCode: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', latitude: -33.9715, longitude: 18.6021, altitude: 46 },
  { icaoCode: 'FAOR', iataCode: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', latitude: -26.1367, longitude: 28.2411, altitude: 1694 },
  { icaoCode: 'HECA', iataCode: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', latitude: 30.1127, longitude: 31.4000, altitude: 74 },
  { icaoCode: 'FMMI', iataCode: 'TNR', name: 'Ivato Airport', city: 'Antananarivo', country: 'Madagascar', latitude: -18.7969, longitude: 47.4788, altitude: 1276 },

  // Oceania
  { icaoCode: 'YSSY', iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753, altitude: 6 },
  { icaoCode: 'YMML', iataCode: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', latitude: -37.6690, longitude: 144.8410, altitude: 132 },
  { icaoCode: 'YBBN', iataCode: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', latitude: -27.3942, longitude: 153.1218, altitude: 4 },
  { icaoCode: 'YPPH', iataCode: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', latitude: -31.9403, longitude: 115.9669, altitude: 19 },
  { icaoCode: 'NZAA', iataCode: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', latitude: -37.0082, longitude: 174.7850, altitude: 7 },
  { icaoCode: 'NZCH', iataCode: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'New Zealand', latitude: -43.4866, longitude: 172.5321, altitude: 37 },

  // South America
  { icaoCode: 'SBGR', iataCode: 'GRU', name: 'São Paulo-Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', latitude: -23.4356, longitude: -46.4731, altitude: 750 },
  { icaoCode: 'SBGL', iataCode: 'GIG', name: 'Rio de Janeiro-Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil', latitude: -22.8099, longitude: -43.2431, altitude: 9 },
  { icaoCode: 'SAEZ', iataCode: 'EZE', name: 'Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentina', latitude: -34.8222, longitude: -58.5358, altitude: 20 },
  { icaoCode: 'SCEL', iataCode: 'SCL', name: 'Santiago International Airport', city: 'Santiago', country: 'Chile', latitude: -33.3927, longitude: -70.7854, altitude: 474 },
  { icaoCode: 'SPJC', iataCode: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru', latitude: -12.0219, longitude: -77.1143, altitude: 113 },
  { icaoCode: 'SKBO', iataCode: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia', latitude: 4.7016, longitude: -74.1469, altitude: 2548 },
]

async function seedAirports() {
  console.log('🛫 Starting airport seeding...')
  
  try {
    // Clear existing airports
    await prisma.airport.deleteMany()
    console.log('🗑️ Cleared existing airports')
    
    // Insert new airports
    const createdAirports = await prisma.airport.createMany({
      data: airports,
      skipDuplicates: true,
    })
    
    console.log(`✅ Successfully seeded ${createdAirports.count} airports`)
    
    // Verify the data
    const totalAirports = await prisma.airport.count()
    console.log(`📊 Total airports in database: ${totalAirports}`)
    
  } catch (error) {
    console.error('❌ Error seeding airports:', error)
    throw error
  }
}

async function main() {
  try {
    await seedAirports()
    console.log('🎉 Airport seeding completed successfully!')
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { seedAirports }
