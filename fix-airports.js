const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check airports with missing or invalid data
    const airports = await prisma.airport.findMany();
    console.log('Airport issues:');
    
    airports.forEach(airport => {
      const issues = [];
      if (!airport.iataCode) issues.push('No IATA code');
      if (airport.city === 'Unknown') issues.push('Unknown city');
      if (airport.country === 'Unknown') issues.push('Unknown country');
      if (airport.latitude === 0 && airport.longitude === 0) issues.push('Invalid coordinates');
      
      if (issues.length > 0) {
        console.log(`${airport.iataCode || 'No IATA'}: ${airport.name} - ${issues.join(', ')}`);
      }
    });
    
    // Let's clean up the VIE airport with correct data
    console.log('\nUpdating VIE airport with correct data...');
    
    await prisma.airport.update({
      where: { id: 'cmd0iaks10001uu4cvxbsnqzv' },
      data: {
        name: 'Vienna International Airport',
        city: 'Vienna',
        country: 'Austria',
        latitude: 48.1103,
        longitude: 16.5697,
        icaoCode: 'LOWW'
      }
    });
    
    console.log('VIE airport updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
