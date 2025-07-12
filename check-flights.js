const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        departureAirport: true,
        arrivalAirport: true,
      },
    });
    
    console.log('Current flights:');
    flights.forEach(flight => {
      console.log(`${flight.id}: ${flight.departureAirport?.code || 'Unknown'} → ${flight.arrivalAirport?.code || 'Unknown'}`);
      if (!flight.departureAirport || !flight.arrivalAirport) {
        console.log('  ⚠️  Missing airport data!');
      }
    });
    
    console.log(`\nTotal flights: ${flights.length}`);
    
    // Check for null airport references
    const orphanedFlights = flights.filter(f => !f.departureAirport || !f.arrivalAirport);
    console.log(`Orphaned flights: ${orphanedFlights.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
