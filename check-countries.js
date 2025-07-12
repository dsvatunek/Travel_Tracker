const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkCountries() {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        departureAirport: true,
        arrivalAirport: true,
      },
    });
    
    console.log('Flight countries:');
    flights.forEach(flight => {
      console.log(`${flight.id}: ${flight.departureAirport.country} → ${flight.arrivalAirport.country}`);
    });
    
    const allCountries = [];
    flights.forEach(flight => {
      allCountries.push(flight.departureAirport.country);
      allCountries.push(flight.arrivalAirport.country);
    });
    
    const uniqueCountries = [...new Set(allCountries)];
    console.log('\nAll countries array:', allCountries);
    console.log('Unique countries:', uniqueCountries);
    console.log('Count:', uniqueCountries.length);
    
    // Check for any case sensitivity issues
    const countriesWithCase = uniqueCountries.map(c => `"${c}"`);
    console.log('Countries with quotes:', countriesWithCase);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCountries();
