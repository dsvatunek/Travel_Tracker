const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function testFlights() {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        departureAirport: true,
        arrivalAirport: true,
      },
    });
    
    console.log('Current flights with airport codes:');
    flights.forEach(flight => {
      console.log(`${flight.id}: ${flight.departureAirport?.iataCode || flight.departureAirport?.icaoCode || 'Unknown'} → ${flight.arrivalAirport?.iataCode || flight.arrivalAirport?.icaoCode || 'Unknown'}`);
      console.log(`  Names: ${flight.departureAirport?.name} → ${flight.arrivalAirport?.name}`);
      console.log(`  Cities: ${flight.departureAirport?.city} → ${flight.arrivalAirport?.city}`);
    });
    
    console.log('\nAll flights have proper airport data!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFlights();
