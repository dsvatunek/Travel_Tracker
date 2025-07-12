import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import Database from 'better-sqlite3'
import path from 'path'

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

// Helper function to lookup airport from global database
async function lookupAirportFromGlobalDB(airportCode: string) {
  try {
    const dbPath = path.join(process.cwd(), 'global_airports_sqlite.db')
    const globalDb = Database(dbPath, { readonly: true })
    
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
        icao_code = ? OR 
        iata_code = ?
      LIMIT 1
    `
    
    const airport = globalDb.prepare(searchQuery).get(
      airportCode.toUpperCase(),
      airportCode.toUpperCase()
    ) as any
    
    globalDb.close()
    
    // Normalize the data before returning
    if (airport) {
      return {
        ...airport,
        country: normalizeCountryName(airport.country),
        city: normalizeCityName(airport.city)
      }
    }
    
    return airport
  } catch (error) {
    console.error('Error looking up airport:', error)
    return null
  }
}

export async function GET() {
  try {
    const flights = await db.flight.findMany({
      include: {
        departureAirport: true,
        arrivalAirport: true,
        images: true
      },
      orderBy: {
        departureTime: 'desc'
      }
    })

    // Transform the data to match frontend expectations
    const transformedFlights = flights.map(flight => ({
      ...flight,
      departureAirport: {
        ...flight.departureAirport,
        code: flight.departureAirport.iataCode || flight.departureAirport.icaoCode || 'Unknown'
      },
      arrivalAirport: {
        ...flight.arrivalAirport,
        code: flight.arrivalAirport.iataCode || flight.arrivalAirport.icaoCode || 'Unknown'
      }
    }))

    return NextResponse.json(transformedFlights)
  } catch (error) {
    console.error('Error fetching flights:', error)
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      flightNumber,
      airline,
      aircraftType,
      aircraftRegistration,
      seatNumber,
      flightClass,
      reason,
      comments,
      departureTime,
      arrivalTime,
      departureAirportCode,
      departureAirportLat,
      departureAirportLng,
      arrivalAirportCode,
      arrivalAirportLat,
      arrivalAirportLng,
      useCoordinates
    } = body

    let departureAirport, arrivalAirport

    if (useCoordinates) {
      // Create airports from coordinates
      departureAirport = await db.airport.create({
        data: {
          iataCode: `COORD_${Date.now()}_DEP`,
          name: 'Custom Location',
          city: 'Custom Location',
          country: 'Unknown',
          latitude: parseFloat(departureAirportLat),
          longitude: parseFloat(departureAirportLng)
        }
      })

      arrivalAirport = await db.airport.create({
        data: {
          iataCode: `COORD_${Date.now()}_ARR`,
          name: 'Custom Location',
          city: 'Custom Location',
          country: 'Unknown',
          latitude: parseFloat(arrivalAirportLat),
          longitude: parseFloat(arrivalAirportLng)
        }
      })
    } else {
      // Handle text-based airport inputs - lookup from global database
      const departureAirportData = await lookupAirportFromGlobalDB(departureAirportCode)
      const arrivalAirportData = await lookupAirportFromGlobalDB(arrivalAirportCode)

      if (departureAirportData) {
        // Use airport data from global database
        departureAirport = await db.airport.upsert({
          where: { iataCode: departureAirportData.iata_code || departureAirportData.icao_code },
          update: {},
          create: {
            iataCode: departureAirportData.iata_code === 'N/A' ? null : departureAirportData.iata_code,
            icaoCode: departureAirportData.icao_code === 'N/A' ? null : departureAirportData.icao_code,
            name: departureAirportData.name,
            city: departureAirportData.city,
            country: departureAirportData.country,
            latitude: departureAirportData.lat_decimal,
            longitude: departureAirportData.lon_decimal
          }
        })
      } else {
        // Create a custom airport entry for unknown airports/names
        const customDepartureCode = departureAirportCode.length <= 4 ? departureAirportCode.toUpperCase() : `CUSTOM_${Date.now()}_DEP`
        departureAirport = await db.airport.create({
          data: {
            iataCode: customDepartureCode,
            name: departureAirportCode,
            city: 'Unknown',
            country: 'Unknown',
            latitude: 0, // Default coordinates, can be updated later
            longitude: 0
          }
        })
      }

      if (arrivalAirportData) {
        // Use airport data from global database
        arrivalAirport = await db.airport.upsert({
          where: { iataCode: arrivalAirportData.iata_code || arrivalAirportData.icao_code },
          update: {},
          create: {
            iataCode: arrivalAirportData.iata_code === 'N/A' ? null : arrivalAirportData.iata_code,
            icaoCode: arrivalAirportData.icao_code === 'N/A' ? null : arrivalAirportData.icao_code,
            name: arrivalAirportData.name,
            city: arrivalAirportData.city,
            country: arrivalAirportData.country,
            latitude: arrivalAirportData.lat_decimal,
            longitude: arrivalAirportData.lon_decimal
          }
        })
      } else {
        // Create a custom airport entry for unknown airports/names
        const customArrivalCode = arrivalAirportCode.length <= 4 ? arrivalAirportCode.toUpperCase() : `CUSTOM_${Date.now()}_ARR`
        arrivalAirport = await db.airport.create({
          data: {
            iataCode: customArrivalCode,
            name: arrivalAirportCode,
            city: 'Unknown',
            country: 'Unknown',
            latitude: 0, // Default coordinates, can be updated later
            longitude: 0
          }
        })
      }
    }

    // Create flight
    const flight = await db.flight.create({
      data: {
        flightNumber,
        airline,
        aircraftType,
        aircraftRegistration,
        seatNumber,
        flightClass,
        reason,
        comments,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        departureAirportId: departureAirport.id,
        arrivalAirportId: arrivalAirport.id
      },
      include: {
        departureAirport: true,
        arrivalAirport: true,
        images: true
      }
    })

    // Transform the data to match frontend expectations
    const transformedFlight = {
      ...flight,
      departureAirport: {
        ...flight.departureAirport,
        code: flight.departureAirport.iataCode || flight.departureAirport.icaoCode || 'Unknown'
      },
      arrivalAirport: {
        ...flight.arrivalAirport,
        code: flight.arrivalAirport.iataCode || flight.arrivalAirport.icaoCode || 'Unknown'
      }
    }

    return NextResponse.json(transformedFlight, { status: 201 })
  } catch (error) {
    console.error('Error creating flight:', error)
    return NextResponse.json({ error: 'Failed to create flight' }, { status: 500 })
  }
}
