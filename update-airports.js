const Database = require('better-sqlite3');
const path = require('path');
const { PrismaClient } = require('./src/generated/prisma');

// Helper function to normalize country names (convert from ALL CAPS to proper case)
function normalizeCountryName(country) {
  if (!country) return 'Unknown'
  
  // Convert to lowercase, then capitalize each word
  return country.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

// Helper function to normalize city names
function normalizeCityName(city) {
  if (!city) return 'Unknown'
  
  // Convert to lowercase, then capitalize each word
  return city.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

async function updateExistingAirports() {
  const prisma = new PrismaClient();
  const dbPath = path.join(process.cwd(), 'global_airports_sqlite.db');
  const globalDb = Database(dbPath, { readonly: true });
  
  try {
    console.log('Updating existing airports with normalized data...');
    
    // Get all airports from our database
    const airports = await prisma.airport.findMany();
    
    for (const airport of airports) {
      const code = airport.iataCode || airport.icaoCode;
      if (!code) continue;
      
      // Look up the airport in the global database
      const globalAirport = globalDb.prepare(`
        SELECT icao_code, iata_code, name, city, country, lat_decimal, lon_decimal
        FROM airports 
        WHERE icao_code = ? OR iata_code = ?
        LIMIT 1
      `).get(code.toUpperCase(), code.toUpperCase());
      
      if (globalAirport) {
        console.log(`Updating ${code}: ${globalAirport.country} -> ${normalizeCountryName(globalAirport.country)}`);
        
        await prisma.airport.update({
          where: { id: airport.id },
          data: {
            country: normalizeCountryName(globalAirport.country),
            city: normalizeCityName(globalAirport.city),
            name: globalAirport.name, // Also update name to match global DB
          }
        });
      }
    }
    
    console.log('Finished updating airports');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    globalDb.close();
    await prisma.$disconnect();
  }
}

updateExistingAirports();
