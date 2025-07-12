import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const flightId = params.id

    // Delete the flight
    await db.flight.delete({
      where: {
        id: flightId
      }
    })

    return NextResponse.json({ message: 'Flight deleted successfully' })
  } catch (error) {
    console.error('Error deleting flight:', error)
    return NextResponse.json({ error: 'Failed to delete flight' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const flightId = params.id
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

    // For editing, we'll keep the existing airports or find/create new ones
    // This is a simplified approach - in production you might want more sophisticated logic
    
    // Update the flight
    const updatedFlight = await db.flight.update({
      where: { id: flightId },
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
        // Note: For simplicity, we're not updating airports in this example
        // In a full implementation, you'd handle airport updates here
      },
      include: {
        departureAirport: true,
        arrivalAirport: true,
        images: true
      }
    })

    // Transform the data to match frontend expectations
    const transformedFlight = {
      ...updatedFlight,
      departureAirport: {
        ...updatedFlight.departureAirport,
        code: updatedFlight.departureAirport.iataCode || updatedFlight.departureAirport.icaoCode || 'Unknown'
      },
      arrivalAirport: {
        ...updatedFlight.arrivalAirport,
        code: updatedFlight.arrivalAirport.iataCode || updatedFlight.arrivalAirport.icaoCode || 'Unknown'
      }
    }

    return NextResponse.json(transformedFlight)
  } catch (error) {
    console.error('Error updating flight:', error)
    return NextResponse.json({ error: 'Failed to update flight' }, { status: 500 })
  }
}
