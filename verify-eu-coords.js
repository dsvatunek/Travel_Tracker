// Let's verify the EU airport coordinates by looking them up manually
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'global_airports_sqlite.db');
const db = Database(dbPath, { readonly: true });

console.log('Checking EU airport coordinates in global database:');

const airports = ['VIE', 'FRA', 'DRS'];
airports.forEach(code => {
  const airport = db.prepare(`
    SELECT iata_code, icao_code, name, city, country, lat_decimal, lon_decimal
    FROM airports 
    WHERE iata_code = ? OR icao_code = ?
    LIMIT 1
  `).get(code, code);
  
  if (airport) {
    console.log(`\n${code} (${airport.icao_code || 'N/A'}):`);
    console.log(`  Name: ${airport.name}`);
    console.log(`  City: ${airport.city}, ${airport.country}`);
    console.log(`  Coordinates: ${airport.lat_decimal}, ${airport.lon_decimal}`);
    
    // Validate coordinates
    if (airport.country === 'GERMANY' || airport.country === 'AUSTRIA') {
      if (airport.lat_decimal < 45 || airport.lat_decimal > 55 || 
          airport.lon_decimal < 5 || airport.lon_decimal > 20) {
        console.log(`  ⚠️  These coordinates seem wrong for Central Europe!`);
      } else {
        console.log(`  ✓ Coordinates look correct for Central Europe`);
      }
    }
  } else {
    console.log(`${code}: NOT FOUND`);
  }
});

db.close();

// Also test a few manual coordinate checks
console.log('\nManual coordinate verification:');
console.log('Frankfurt should be around: 50.0°N, 8.6°E');
console.log('Vienna should be around: 48.2°N, 16.4°E');
console.log('Dresden should be around: 51.1°N, 13.8°E');
