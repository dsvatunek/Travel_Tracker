'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.geodesic'
import L from 'leaflet'

// Extend L namespace for geodesic
declare module 'leaflet' {
  namespace L {
    function geodesic(latlngs: [number, number][][], options?: any): any
  }
}

// Custom component for geodesic lines
function GeodesicPolyline({ 
  start, 
  end, 
  color = "#3B82F6", 
  weight = 3, 
  opacity = 0.8,
  children 
}: { 
  start: [number, number], 
  end: [number, number], 
  color?: string, 
  weight?: number, 
  opacity?: number,
  children?: React.ReactNode 
}) {
  const map = useMap()
  
  useEffect(() => {
    const geodesicLine = L.geodesic([
      [start, end]
    ], {
      weight: weight,
      steps: 2000,
      color: color,
      opacity: opacity
    }).addTo(map)
    
    // Add popup if children provided
    if (children) {
      const popupContent = document.createElement('div')
      // This is a simplified approach - you might want to use ReactDOM.render for complex content
      popupContent.innerHTML = typeof children === 'string' ? children : ''
      geodesicLine.bindPopup(popupContent)
    }
    
    return () => {
      map.removeLayer(geodesicLine)
    }
  }, [map, start, end, color, weight, opacity, children])
  
  return null
}

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Function to calculate great circle distance in kilometers (kept for reference)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180
  const R = 6371 // Earth's radius in kilometers
  
  const lat1Rad = toRadians(lat1)
  const lon1Rad = toRadians(lon1)
  const lat2Rad = toRadians(lat2)
  const lon2Rad = toRadians(lon2)
  
  const deltaLat = lat2Rad - lat1Rad
  const deltaLon = lon2Rad - lon1Rad
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
  const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * angularDistance
}

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
        {showFlights && flights.map((flight) => {          
          return (
            <GeodesicPolyline
              key={flight.id}
              start={[flight.departureAirport.latitude, flight.departureAirport.longitude]}
              end={[flight.arrivalAirport.latitude, flight.arrivalAirport.longitude]}
              color="#3B82F6"
              weight={3}
              opacity={0.8}
            >
              {`${flight.flightNumber ? flight.flightNumber + ' - ' : ''}${flight.airline}<br/>
               ${flight.departureAirport.code} → ${flight.arrivalAirport.code}<br/>
               ${new Date(flight.departureTime).toLocaleDateString()}`}
            </GeodesicPolyline>
          )
        })}
      </MapContainer>
    </div>
  )
}
