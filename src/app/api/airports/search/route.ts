import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

interface Airport {
  icao_code: string
  iata_code: string
  name: string
  city: string
  country: string
  lat_decimal: number
  lon_decimal: number
}

// Helper function to normalize country names (convert from ALL CAPS to proper case)
function normalizeCountryName(country: string): string {
  if (!country) return 'Unknown'
  
  // Convert to lowercase, then capitalize each word
  return country.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

// Helper function to normalize city names
function normalizeCityName(city: string): string {
  if (!city) return 'Unknown'
  
  // Convert to lowercase, then capitalize each word
  return city.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  if (!query || query.length < 2) {
    return NextResponse.json({ airports: [] })
  }

  try {
    // Connect to the global airports database
    const dbPath = path.join(process.cwd(), 'global_airports_sqlite.db')
    const db = Database(dbPath, { readonly: true })
    
    // Search by ICAO code, IATA code, airport name, or city
    const searchQuery = `
      SELECT 
        icao_code,
        iata_code,
        name,
        city,
        country,
        lat_decimal,
        lon_decimal
      FROM airports 
      WHERE 
        icao_code LIKE ? OR 
        iata_code LIKE ? OR 
        name LIKE ? OR 
        city LIKE ?
      ORDER BY 
        CASE 
          WHEN icao_code = ? THEN 1
          WHEN iata_code = ? THEN 2
          WHEN icao_code LIKE ? THEN 3
          WHEN iata_code LIKE ? THEN 4
          ELSE 5
        END,
        name
      LIMIT 20
    `
    
    const searchTerm = query.toUpperCase()
    const likeSearchTerm = `%${searchTerm}%`
    
    const airports = db.prepare(searchQuery).all(
      likeSearchTerm, // icao_code LIKE
      likeSearchTerm, // iata_code LIKE
      likeSearchTerm, // airport_name LIKE
      likeSearchTerm, // city_town LIKE
      searchTerm,     // icao_code = (exact match priority)
      searchTerm,     // iata_code = (exact match priority)
      searchTerm + '%', // icao_code LIKE (prefix match)
      searchTerm + '%'  // iata_code LIKE (prefix match)
    ) as Airport[]
    
    // Normalize the airport data before returning
    const normalizedAirports = airports.map(airport => ({
      ...airport,
      country: normalizeCountryName(airport.country),
      city: normalizeCityName(airport.city)
    }))
    
    db.close()
    
    return NextResponse.json({ airports: normalizedAirports })
    
  } catch (error) {
    console.error('Airport search error:', error)
    return NextResponse.json({ error: 'Failed to search airports' }, { status: 500 })
  }
}
