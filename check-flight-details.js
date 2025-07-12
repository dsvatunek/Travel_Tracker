const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const flight = await prisma.flight.findUnique({
      where: { id: 'cmd0j4l5i0007uu4cewgybgcm' },
      include: {
        departureAirport: true,
        arrivalAirport: true,
      },
    });
    
    console.log('Flight details:');
    console.log(JSON.stringify(flight, null, 2));
    
    // Check all airports
    console.log('\nAll airports:');
    const airports = await prisma.airport.findMany();
    airports.forEach(airport => {
      console.log(`${airport.code}: ${airport.name} (${airport.city}, ${airport.country})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
