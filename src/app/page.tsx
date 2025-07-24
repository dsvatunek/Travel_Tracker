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
    <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
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
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

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

  const handleDateRangeChange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }, [])

  // Filter flights by date range
  const filteredFlights = flights.filter(flight => {
    if (!startDate || !endDate) return true
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your travel data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">Travel Tracker</h1>
            <p className="text-gray-400">Your personal flight and travel history</p>
          </div>
          <Link 
            href="/admin"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Settings size={20} />
            Manage Flights
          </Link>
        </div>

        {/* Main Content - Stats Left, Map Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Left Sidebar - Stats and Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Travel Stats</h3>
              
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-900 rounded-full">
                    <Plane className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-400">Total Flights</p>
                    <p className="text-xl font-bold text-white">{stats.totalFlights}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-900 rounded-full">
                    <MapPin className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-400">Airports Visited</p>
                    <p className="text-xl font-bold text-white">{stats.uniqueAirports}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-900 rounded-full">
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-400">Countries Visited</p>
                    <p className="text-xl font-bold text-white">{stats.uniqueCountries}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
              <h3 className="text-lg font-semibold mb-4 text-white">Display Options</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFlights}
                    onChange={(e) => setShowFlights(e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <span className="text-sm text-gray-300">Show Flight Paths</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAirports}
                    onChange={(e) => setShowAirports(e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <span className="text-sm text-gray-300">Show Airports</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCountries}
                    onChange={(e) => setShowCountries(e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <span className="text-sm text-gray-300">Show Countries</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side - Bigger Map */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Flight Map</h3>
              <div className="h-[600px]">
                <MapView
                  flights={filteredFlights}
                  showFlights={showFlights}
                  showAirports={showAirports}
                  showCountries={showCountries}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline - Temporarily commented out due to type issues */}
        {/*
        <Timeline
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          flights={flights}
        />
        */}
      </div>
    </div>
  )
}
