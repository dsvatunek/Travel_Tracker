const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'global_airports_sqlite.db');
const db = Database(dbPath, { readonly: true });

console.log('Checking country names in global airport database...');

// Check how Germany is stored
const germanyAirports = db.prepare(`
  SELECT DISTINCT country FROM airports 
  WHERE country LIKE '%german%' OR country LIKE '%GERMAN%'
  LIMIT 10
`).all();

console.log('Germany variants:', germanyAirports);

// Check specific airports
const specificAirports = db.prepare(`
  SELECT iata_code, icao_code, name, city, country 
  FROM airports 
  WHERE iata_code IN ('FRA', 'DRS', 'VIE') OR icao_code IN ('EDDF', 'EDDC', 'LOWW')
`).all();

console.log('\nSpecific airports:');
specificAirports.forEach(airport => {
  console.log(`${airport.iata_code || airport.icao_code}: ${airport.name} - ${airport.country}`);
});

db.close();
