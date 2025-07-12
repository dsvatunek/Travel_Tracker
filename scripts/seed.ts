import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const airports = [
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', latitude: 33.9425, longitude: -118.4081 },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', latitude: 40.6413, longitude: -73.7781 },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK', latitude: 51.4700, longitude: -0.4543 },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', latitude: 35.7647, longitude: 140.3864 },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', latitude: 25.2532, longitude: 55.3657 },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753 },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248 },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
]

async function seed() {
  console.log('Seeding database...')
  
  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { code: airport.code },
      update: {},
      create: airport,
    })
  }
  
  console.log('Database seeded successfully!')
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
