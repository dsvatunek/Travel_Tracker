'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.geodesic'
import L from 'leaflet'
import { mapConfig, normalizeCountryName } from '@/config/mapConfig'

// Extend L namespace for geodesic
declare module 'leaflet' {
  namespace L {
    function geodesic(latlngs: [number, number][][], options?: any): any
  }
}

// Component to handle country boundaries
function CountryBoundaries({ visitedCountries, showCountries }: { visitedCountries: Set<string>, showCountries: boolean }) {
  const [countriesData, setCountriesData] = useState<any>(null)
  const map = useMap()

  useEffect(() => {
    // Always run the effect, but only fetch when needed
    const loadCountries = async () => {
      if (!showCountries) {
        setCountriesData(null)
        return
      }

      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        const data = await response.json()
        setCountriesData(data)
      } catch (error) {
        console.error('Error loading country data:', error)
        setCountriesData(null)
      }
    }

    loadCountries()
  }, [showCountries]) // Only depend on showCountries

  if (!showCountries || !countriesData) return null

  const getCountryStyle = (feature: any) => {
    const countryName = feature.properties.name || feature.properties.NAME || feature.properties.NAME_EN
    
    // Check if any visited country matches this GeoJSON country
    const isVisited = Array.from(visitedCountries).some(visitedCountry => {
      const normalizedVisited = normalizeCountryName(visitedCountry)
      const normalizedGeoJson = normalizeCountryName(countryName)
      return normalizedVisited === normalizedGeoJson || 
             normalizedGeoJson.includes(normalizedVisited) ||
             normalizedVisited.includes(normalizedGeoJson)
    })
    
    // Only show visited countries with light green fill, hide unvisited ones
    if (!isVisited) {
      return {
        fillColor: mapConfig.countries.unvisited.fillColor,
        weight: mapConfig.countries.unvisited.borderWeight,
        opacity: mapConfig.countries.unvisited.borderOpacity,
        color: mapConfig.countries.unvisited.borderColor,
        fillOpacity: mapConfig.countries.unvisited.fillOpacity
      }
    }
    
    return {
      fillColor: mapConfig.countries.visited.fillColor,
      weight: mapConfig.countries.visited.borderWeight,
      opacity: mapConfig.countries.visited.borderOpacity,
      color: mapConfig.countries.visited.borderColor,
      fillOpacity: mapConfig.countries.visited.fillOpacity
    }
  }

  const onEachCountry = (feature: any, layer: any) => {
    const countryName = feature.properties.name || feature.properties.NAME || feature.properties.NAME_EN
    
    // Check if any visited country matches this GeoJSON country
    const isVisited = Array.from(visitedCountries).some(visitedCountry => {
      const normalizedVisited = normalizeCountryName(visitedCountry)
      const normalizedGeoJson = normalizeCountryName(countryName)
      return normalizedVisited === normalizedGeoJson || 
             normalizedGeoJson.includes(normalizedVisited) ||
             normalizedVisited.includes(normalizedGeoJson)
    })
    
    // Only add popups to visited countries since unvisited ones are invisible
    if (isVisited) {
      // Find which visited countries match for debugging
      const matchingCountries = Array.from(visitedCountries).filter(visitedCountry => {
        const normalizedVisited = normalizeCountryName(visitedCountry)
        const normalizedGeoJson = normalizeCountryName(countryName)
        return normalizedVisited === normalizedGeoJson || 
               normalizedGeoJson.includes(normalizedVisited) ||
               normalizedVisited.includes(normalizedGeoJson)
      })
      
      layer.bindPopup(`
        <div>
          <strong>${countryName}</strong><br/>
          <span style="color: ${mapConfig.countries.visited.fillColor}">
            ✓ Visited
          </span>
          ${matchingCountries.length > 0 ? `<br/><small>Matches: ${matchingCountries.join(', ')}</small>` : ''}
        </div>
      `)
    }
  }

  return (
    <GeoJSON
      data={countriesData}
      style={getCountryStyle}
      onEachFeature={onEachCountry}
    />
  )
}

// Custom component for geodesic lines
function GeodesicPolyline({ 
  start, 
  end, 
  color = mapConfig.flightPaths.color, 
  weight = mapConfig.flightPaths.weight, 
  opacity = mapConfig.flightPaths.opacity,
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
    // Create outline (brighter, thicker line)
    const outlineLine = L.geodesic([
      [start, end]
    ], {
      weight: mapConfig.flightPaths.outlineWeight,
      steps: mapConfig.flightPaths.steps,
      color: mapConfig.flightPaths.outlineColor,
      opacity: mapConfig.flightPaths.outlineOpacity
    }).addTo(map)

    // Create main line
    const geodesicLine = L.geodesic([
      [start, end]
    ], {
      weight: weight,
      steps: mapConfig.flightPaths.steps,
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
      map.removeLayer(outlineLine)
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

  // Always call useEffect, regardless of mounted state  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get list of visited countries - always calculate this
  const visitedCountries = new Set([
    ...flights.map(f => f.departureAirport.country),
    ...flights.map(f => f.arrivalAirport.country)
  ])

  // Debug: Log the visited countries - always call useEffect
  useEffect(() => {
    if (visitedCountries.size > 0) {
      console.log('Visited countries from flight data:', Array.from(visitedCountries))
    }
  }, [visitedCountries.size]) // Use size to avoid dependency array issues

  // Get airports list - always calculate this
  const airports = flights.reduce((acc, flight) => {
    if (!acc.find(a => a.code === flight.departureAirport.code)) {
      acc.push(flight.departureAirport)
    }
    if (!acc.find(a => a.code === flight.arrivalAirport.code)) {
      acc.push(flight.arrivalAirport)
    }
    return acc
  }, [] as Flight['departureAirport'][])

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapConfig.map.center}
        zoom={mapConfig.map.zoom}
        className="h-full w-full"
        style={{ height: '100%', width: '100%', backgroundColor: mapConfig.map.backgroundColor }}
        worldCopyJump={mapConfig.map.worldCopyJump}
        maxBounds={mapConfig.map.maxBounds}
        maxBoundsViscosity={mapConfig.map.maxBoundsViscosity}
      >
        <TileLayer
          url={mapConfig.map.tileUrl}
          attribution={mapConfig.map.attribution}
          noWrap={mapConfig.map.noWrap}
          bounds={mapConfig.map.maxBounds}
        />
        
        {/* Country boundaries */}
        <CountryBoundaries 
          visitedCountries={visitedCountries} 
          showCountries={showCountries} 
        />
        
        {/* Airport markers */}
        {showAirports && airports.map((airport) => {
          // Create custom circle marker icon with purple/pink theme
          const airportIcon = L.divIcon({
            className: 'custom-airport-marker',
            html: `<div style="
              width: ${mapConfig.airports.size}px; 
              height: ${mapConfig.airports.size}px; 
              background-color: ${mapConfig.airports.fillColor}; 
              border: ${mapConfig.airports.borderWidth}px solid ${mapConfig.airports.borderColor}; 
              border-radius: 50%; 
              box-shadow: 0 0 6px ${mapConfig.airports.glowColor};
            "></div>`,
            iconSize: mapConfig.airports.iconSize,
            iconAnchor: mapConfig.airports.iconAnchor
          })

          return (
            <Marker
              key={airport.code}
              position={[airport.latitude, airport.longitude]}
              icon={airportIcon}
            >
              <Popup>
                <div className="font-medium">{airport.name}</div>
                <div className="text-sm text-gray-600">{airport.code}</div>
                <div className="text-sm text-gray-500">{airport.city}, {airport.country}</div>
              </Popup>
            </Marker>
          )
        })}

        {/* Flight paths */}
        {showFlights && flights.map((flight) => {          
          return (
            <GeodesicPolyline
              key={flight.id}
              start={[flight.departureAirport.latitude, flight.departureAirport.longitude]}
              end={[flight.arrivalAirport.latitude, flight.arrivalAirport.longitude]}
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
