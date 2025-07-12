const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function fixCountryNames() {
  try {
    // Find the Dresden airport
    const dresdenAirport = await prisma.airport.findFirst({
      where: { iataCode: 'DRS' }
    });
    
    if (dresdenAirport) {
      console.log('Found Dresden airport:', dresdenAirport.country);
      
      // Update to proper case
      await prisma.airport.update({
        where: { id: dresdenAirport.id },
        data: { country: 'Germany' }
      });
      
      console.log('Updated Dresden airport country to "Germany"');
    }
    
    // Check all airports for consistency
    const airports = await prisma.airport.findMany();
    console.log('\nAll airports after fix:');
    airports.forEach(airport => {
      console.log(`${airport.iataCode || airport.icaoCode}: "${airport.country}"`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCountryNames();
