'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Flight {
  id: string
  flightNumber?: string
  airline?: string
  departureTime: string
  arrivalTime: string
  departureAirport: {
    code: string
    name: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  arrivalAirport: {
    code: string
    name: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
}

interface MapViewProps {
  flights: Flight[]
  showFlights: boolean
  showAirports: boolean
  showCountries: boolean
}

export default function MapView({ flights, showFlights, showAirports, showCountries }: MapViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  const airports = flights.reduce((acc, flight) => {
    if (!acc.find(a => a.code === flight.departureAirport.code)) {
      acc.push(flight.departureAirport)
    }
    if (!acc.find(a => a.code === flight.arrivalAirport.code)) {
      acc.push(flight.arrivalAirport)
    }
    return acc
  }, [] as Flight['departureAirport'][])

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Airport markers */}
        {showAirports && airports.map((airport) => (
          <Marker
            key={airport.code}
            position={[airport.latitude, airport.longitude]}
          >
            <Popup>
              <div className="font-medium">{airport.name}</div>
              <div className="text-sm text-gray-600">{airport.code}</div>
              <div className="text-sm text-gray-500">{airport.city}, {airport.country}</div>
            </Popup>
          </Marker>
        ))}

        {/* Flight paths */}
        {showFlights && flights.map((flight) => (
          <Polyline
            key={flight.id}
            positions={[
              [flight.departureAirport.latitude, flight.departureAirport.longitude],
              [flight.arrivalAirport.latitude, flight.arrivalAirport.longitude]
            ]}
            color="#3B82F6"
            weight={2}
            opacity={0.7}
          >
            <Popup>
              <div className="font-medium">
                {flight.flightNumber && `${flight.flightNumber} - `}
                {flight.airline}
              </div>
              <div className="text-sm">
                {flight.departureAirport.code} → {flight.arrivalAirport.code}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(flight.departureTime).toLocaleDateString()}
              </div>
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  )
}
