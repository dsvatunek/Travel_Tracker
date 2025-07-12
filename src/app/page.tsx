'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Plane, Globe, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Timeline from '@/components/Timeline'

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
})

interface Flight {
  id: string
  flightNumber?: string
  airline?: string
  aircraftType?: string
  seatNumber?: string
  flightClass?: string
  reason?: string
  comments?: string
  departureTime: string
  arrivalTime: string
  departureAirport: {
    id: string
    code: string
    name: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  arrivalAirport: {
    id: string
    code: string
    name: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  images: any[]
}

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [showFlights, setShowFlights] = useState(true)
  const [showAirports, setShowAirports] = useState(true)
  const [showCountries, setShowCountries] = useState(false)
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear() - 1, 0, 1))
  const [endDate, setEndDate] = useState(new Date())

  const fetchFlights = async () => {
    try {
      const response = await fetch('/api/flights')
      if (response.ok) {
        const data = await response.json()
        setFlights(data)
      }
    } catch (error) {
      console.error('Error fetching flights:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }, [])

  const filteredFlights = flights.filter(flight => {
    const flightDate = new Date(flight.departureTime)
    return flightDate >= startDate && flightDate <= endDate
  })

  const stats = {
    totalFlights: filteredFlights.length,
    uniqueAirports: new Set([
      ...filteredFlights.map(f => f.departureAirport.code),
      ...filteredFlights.map(f => f.arrivalAirport.code)
    ]).size,
    uniqueCountries: new Set([
      ...filteredFlights.map(f => f.departureAirport.country),
      ...filteredFlights.map(f => f.arrivalAirport.country)
    ]).size
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your travel data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Tracker</h1>
            <p className="text-gray-600">Your personal flight and travel history</p>
          </div>
          <Link 
            href="/admin"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Settings size={20} />
            Manage Flights
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Flights</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFlights}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Airports Visited</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueAirports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Countries Visited</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueCountries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Display Options</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFlights}
                onChange={(e) => setShowFlights(e.target.checked)}
                className="mr-2"
              />
              Show Flight Paths
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAirports}
                onChange={(e) => setShowAirports(e.target.checked)}
                className="mr-2"
              />
              Show Airports
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showCountries}
                onChange={(e) => setShowCountries(e.target.checked)}
                className="mr-2"
              />
              Show Countries
            </label>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Flight Map</h3>
          <MapView
            flights={filteredFlights}
            showFlights={showFlights}
            showAirports={showAirports}
            showCountries={showCountries}
          />
        </div>

        {/* Timeline */}
        <Timeline
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          flights={flights}
        />
      </div>
    </div>
  )
}
