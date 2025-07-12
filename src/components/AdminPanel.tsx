'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

interface FlightFormData {
  flightNumber: string
  airline: string
  aircraftType: string
  aircraftRegistration: string
  seatNumber: string
  flightClass: string
  reason: string
  comments: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  departureAirportCode: string
  departureAirportLat: string
  departureAirportLng: string
  arrivalAirportCode: string
  arrivalAirportLat: string
  arrivalAirportLng: string
  useCoordinates: boolean
  departureCoordinates: string // Google Maps format: "lat,lng"
  arrivalCoordinates: string // Google Maps format: "lat,lng"
  useGoogleMapsFormat: boolean
}

interface Airport {
  icao_code: string
  iata_code: string
  name: string
  city: string
  country: string
  lat_decimal: number
  lon_decimal: number
}

const AIRPORTS = [
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
]

interface AdminPanelProps {
  onFlightAdded: () => void
  onClose?: () => void
  editingFlight?: Flight | null
}

interface Flight {
  id: string
  flightNumber?: string
  airline?: string
  aircraftType?: string
  aircraftRegistration?: string
  seatNumber?: string
  flightClass?: string
  reason?: string
  comments?: string
  departureTime: string
  arrivalTime: string
  departureAirport: {
    id: string
    iataCode?: string
    icaoCode?: string
    name: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  arrivalAirport: {
    id: string
    iataCode?: string
    icaoCode?: string
    name: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  images: any[]
}

export default function AdminPanel({ onFlightAdded, onClose, editingFlight }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Airport search state
  const [departureAirports, setDepartureAirports] = useState<Airport[]>([])
  const [arrivalAirports, setArrivalAirports] = useState<Airport[]>([])
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false)
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false)
  const [searchingDeparture, setSearchingDeparture] = useState(false)
  const [searchingArrival, setSearchingArrival] = useState(false)
  
  // Common input styles for better contrast
  const inputStyles = "w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white text-gray-900 placeholder-gray-500 font-medium"
  const selectStyles = "w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white text-gray-900 font-medium"
  const textareaStyles = "w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
  const labelStyles = "block text-sm font-bold text-gray-900 mb-2"
  const [formData, setFormData] = useState<FlightFormData>({
    flightNumber: '',
    airline: '',
    aircraftType: '',
    aircraftRegistration: '',
    seatNumber: '',
    flightClass: 'Economy',
    reason: 'Leisure',
    comments: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    departureAirportCode: '',
    departureAirportLat: '',
    departureAirportLng: '',
    arrivalAirportCode: '',
    arrivalAirportLat: '',
    arrivalAirportLng: '',
    useCoordinates: false,
    departureCoordinates: '',
    arrivalCoordinates: '',
    useGoogleMapsFormat: false
  })

  // Populate form when editing
  useEffect(() => {
    if (editingFlight) {
      const depDate = new Date(editingFlight.departureTime)
      const arrDate = new Date(editingFlight.arrivalTime)
      
      setFormData({
        flightNumber: editingFlight.flightNumber || '',
        airline: editingFlight.airline || '',
        aircraftType: editingFlight.aircraftType || '',
        aircraftRegistration: editingFlight.aircraftRegistration || '',
        seatNumber: editingFlight.seatNumber || '',
        flightClass: editingFlight.flightClass || 'Economy',
        reason: editingFlight.reason || 'Leisure',
        comments: editingFlight.comments || '',
        departureDate: depDate.toISOString().split('T')[0],
        departureTime: depDate.toTimeString().substring(0, 5),
        arrivalDate: arrDate.toISOString().split('T')[0],
        arrivalTime: arrDate.toTimeString().substring(0, 5),
        departureAirportCode: editingFlight.departureAirport.iataCode || editingFlight.departureAirport.icaoCode || '',
        departureAirportLat: editingFlight.departureAirport.latitude.toString(),
        departureAirportLng: editingFlight.departureAirport.longitude.toString(),
        arrivalAirportCode: editingFlight.arrivalAirport.iataCode || editingFlight.arrivalAirport.icaoCode || '',
        arrivalAirportLat: editingFlight.arrivalAirport.latitude.toString(),
        arrivalAirportLng: editingFlight.arrivalAirport.longitude.toString(),
        useCoordinates: false,
        departureCoordinates: '',
        arrivalCoordinates: '',
        useGoogleMapsFormat: false
      })
      setIsOpen(true)
    }
  }, [editingFlight])

  // Airport search functions
  const searchAirports = async (query: string, type: 'departure' | 'arrival') => {
    if (query.length < 2) {
      if (type === 'departure') {
        setDepartureAirports([])
        setShowDepartureDropdown(false)
      } else {
        setArrivalAirports([])
        setShowArrivalDropdown(false)
      }
      return
    }

    const isSearching = type === 'departure' ? setSearchingDeparture : setSearchingArrival
    isSearching(true)

    try {
      const response = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (type === 'departure') {
        setDepartureAirports(data.airports || [])
        setShowDepartureDropdown(true)
      } else {
        setArrivalAirports(data.airports || [])
        setShowArrivalDropdown(true)
      }
    } catch (error) {
      console.error('Airport search error:', error)
    } finally {
      isSearching(false)
    }
  }

  const selectAirport = (airport: Airport, type: 'departure' | 'arrival') => {
    const airportCode = airport.iata_code || airport.icao_code
    
    if (type === 'departure') {
      setFormData(prev => ({
        ...prev,
        departureAirportCode: airportCode
      }))
      setShowDepartureDropdown(false)
    } else {
      setFormData(prev => ({
        ...prev,
        arrivalAirportCode: airportCode
      }))
      setShowArrivalDropdown(false)
    }
  }

  const handleAirportInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleChange(e)
    
    if (name === 'departureAirportCode') {
      searchAirports(value, 'departure')
    } else if (name === 'arrivalAirportCode') {
      searchAirports(value, 'arrival')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.departureDate || !formData.arrivalDate) {
      alert('Please fill in departure and arrival dates')
      setIsSubmitting(false)
      return
    }

    if (!formData.useCoordinates && (!formData.departureAirportCode || !formData.arrivalAirportCode)) {
      alert('Please fill in airport codes or enable coordinates mode')
      setIsSubmitting(false)
      return
    }

    if (formData.useCoordinates) {
      if (formData.useGoogleMapsFormat) {
        if (!formData.departureCoordinates || !formData.arrivalCoordinates) {
          alert('Please fill in all coordinates in Google Maps format')
          setIsSubmitting(false)
          return
        }
      } else {
        if (!formData.departureAirportLat || !formData.departureAirportLng || !formData.arrivalAirportLat || !formData.arrivalAirportLng) {
          alert('Please fill in all coordinates')
          setIsSubmitting(false)
          return
        }
      }
    }

    // Parse coordinates from Google Maps format if needed
    let processedFormData = { ...formData }
    if (formData.useCoordinates && formData.useGoogleMapsFormat) {
      try {
        const [depLat, depLng] = formData.departureCoordinates.split(',').map(coord => coord.trim())
        const [arrLat, arrLng] = formData.arrivalCoordinates.split(',').map(coord => coord.trim())
        
        processedFormData.departureAirportLat = depLat
        processedFormData.departureAirportLng = depLng
        processedFormData.arrivalAirportLat = arrLat
        processedFormData.arrivalAirportLng = arrLng
      } catch (error) {
        alert('Invalid coordinate format. Please use "latitude,longitude" format (e.g., "33.9425,-118.4081")')
        setIsSubmitting(false)
        return
      }
    }

    // Create date objects with optional time
    const departureDateTime = formData.departureTime 
      ? new Date(`${formData.departureDate}T${formData.departureTime}`)
      : new Date(`${formData.departureDate}T12:00:00`)
    
    const arrivalDateTime = formData.arrivalTime 
      ? new Date(`${formData.arrivalDate}T${formData.arrivalTime}`)
      : new Date(`${formData.arrivalDate}T12:00:00`)

    const submissionData = {
      ...processedFormData,
      departureTime: departureDateTime.toISOString(),
      arrivalTime: arrivalDateTime.toISOString()
    }

    try {
      const url = editingFlight ? `/api/flights/${editingFlight.id}` : '/api/flights'
      const method = editingFlight ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      console.log(`${method} request to ${url}:`, response.status, response.statusText)

      if (response.ok) {
        console.log(`${editingFlight ? 'Update' : 'Create'} successful`)
        // Reset form
        setFormData({
          flightNumber: '',
          airline: '',
          aircraftType: '',
          aircraftRegistration: '',
          seatNumber: '',
          flightClass: 'Economy',
          reason: 'Leisure',
          comments: '',
          departureDate: '',
          departureTime: '',
          arrivalDate: '',
          arrivalTime: '',
          departureAirportCode: '',
          departureAirportLat: '',
          departureAirportLng: '',
          arrivalAirportCode: '',
          arrivalAirportLat: '',
          arrivalAirportLng: '',
          useCoordinates: false,
          departureCoordinates: '',
          arrivalCoordinates: '',
          useGoogleMapsFormat: false
        })
        setIsOpen(false)
        onFlightAdded()
        onClose?.()
      } else {
        const errorData = await response.json()
        alert(`Error ${editingFlight ? 'updating' : 'adding'} flight: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error ${editingFlight ? 'updating' : 'adding'} flight: Network error`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={24} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingFlight ? 'Edit Flight' : 'Add New Flight'}
          </h2>
          <button
            onClick={() => {
              setIsOpen(false)
              onClose?.()
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Flight Information */}            <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Flight Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>
                  Flight Number
                </label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="e.g., UA123"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>
                  Airline
                </label>
                <input
                  type="text"
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  placeholder="e.g., United Airlines"
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>
                  Aircraft Type
                </label>
                <input
                  type="text"
                  name="aircraftType"
                  value={formData.aircraftType}
                  onChange={handleChange}
                  placeholder="e.g., Boeing 777-300ER"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>
                  Aircraft Registration
                </label>
                <input
                  type="text"
                  name="aircraftRegistration"
                  value={formData.aircraftRegistration}
                  onChange={handleChange}
                  placeholder="e.g., N123AA"
                  className={inputStyles}
                />
              </div>
            </div>
          </div>

          {/* Airport Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2">
              <h3 className="text-lg font-bold text-gray-900">Airport Information</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useCoordinates"
                  name="useCoordinates"
                  checked={formData.useCoordinates}
                  onChange={(e) => setFormData(prev => ({ ...prev, useCoordinates: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="useCoordinates" className="ml-2 text-sm font-bold text-gray-900">
                  Use Coordinates (for seaplanes, etc.)
                </label>
              </div>
            </div>

            {!formData.useCoordinates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className={labelStyles}>
                    Departure Airport <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="departureAirportCode"
                    value={formData.departureAirportCode}
                    onChange={handleAirportInputChange}
                    onFocus={() => {
                      if (formData.departureAirportCode.length >= 2) {
                        setShowDepartureDropdown(true)
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding dropdown to allow for clicks
                      setTimeout(() => setShowDepartureDropdown(false), 200)
                    }}
                    placeholder="e.g., LAX or Los Angeles International"
                    className={inputStyles}
                    required
                  />
                  <p className="text-xs text-gray-600 font-medium mt-1">Enter airport code (e.g., LAX) or airport name</p>
                  
                  {showDepartureDropdown && departureAirports.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {departureAirports.map((airport, index) => (
                        <div
                          key={`${airport.icao_code}-${airport.iata_code}-${index}`}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectAirport(airport, 'departure')}
                        >
                          <div className="font-medium text-gray-900">
                            {airport.iata_code && airport.icao_code 
                              ? `${airport.iata_code} / ${airport.icao_code}`
                              : airport.iata_code || airport.icao_code}
                          </div>
                          <div className="text-sm text-gray-600">{airport.name}</div>
                          <div className="text-xs text-gray-500">{airport.city}, {airport.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchingDeparture && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
                      <div className="text-sm text-gray-600">Searching airports...</div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className={labelStyles}>
                    Arrival Airport <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="arrivalAirportCode"
                    value={formData.arrivalAirportCode}
                    onChange={handleAirportInputChange}
                    onFocus={() => {
                      if (formData.arrivalAirportCode.length >= 2) {
                        setShowArrivalDropdown(true)
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding dropdown to allow for clicks
                      setTimeout(() => setShowArrivalDropdown(false), 200)
                    }}
                    placeholder="e.g., JFK or John F. Kennedy International"
                    className={inputStyles}
                    required
                  />
                  <p className="text-xs text-gray-600 font-medium mt-1">Enter airport code (e.g., JFK) or airport name</p>
                  
                  {showArrivalDropdown && arrivalAirports.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {arrivalAirports.map((airport, index) => (
                        <div
                          key={`${airport.icao_code}-${airport.iata_code}-${index}`}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectAirport(airport, 'arrival')}
                        >
                          <div className="font-medium text-gray-900">
                            {airport.iata_code && airport.icao_code 
                              ? `${airport.iata_code} / ${airport.icao_code}`
                              : airport.iata_code || airport.icao_code}
                          </div>
                          <div className="text-sm text-gray-600">{airport.name}</div>
                          <div className="text-xs text-gray-500">{airport.city}, {airport.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchingArrival && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
                      <div className="text-sm text-gray-600">Searching airports...</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useGoogleMapsFormat"
                    name="useGoogleMapsFormat"
                    checked={formData.useGoogleMapsFormat}
                    onChange={(e) => setFormData(prev => ({ ...prev, useGoogleMapsFormat: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useGoogleMapsFormat" className="ml-2 text-sm font-bold text-gray-900">
                    Use Google Maps Format (latitude,longitude)
                  </label>
                </div>

                {formData.useGoogleMapsFormat ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>
                        Departure Coordinates <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="departureCoordinates"
                        value={formData.departureCoordinates}
                        onChange={handleChange}
                        placeholder="e.g., 33.9425,-118.4081"
                        className={inputStyles}
                      />
                      <p className="text-xs text-gray-600 font-medium mt-1">Format: latitude,longitude</p>
                    </div>

                    <div>
                      <label className={labelStyles}>
                        Arrival Coordinates <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="arrivalCoordinates"
                        value={formData.arrivalCoordinates}
                        onChange={handleChange}
                        placeholder="e.g., 40.6413,-73.7781"
                        className={inputStyles}
                      />
                      <p className="text-xs text-gray-600 font-medium mt-1">Format: latitude,longitude</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelStyles}>
                          Departure Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="departureAirportLat"
                          value={formData.departureAirportLat}
                          onChange={handleChange}
                          placeholder="e.g., 33.9425"
                          step="any"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className={labelStyles}>
                          Departure Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="departureAirportLng"
                          value={formData.departureAirportLng}
                          onChange={handleChange}
                          placeholder="e.g., -118.4081"
                          step="any"
                          className={inputStyles}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelStyles}>
                          Arrival Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="arrivalAirportLat"
                          value={formData.arrivalAirportLat}
                          onChange={handleChange}
                          placeholder="e.g., 40.6413"
                          step="any"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className={labelStyles}>
                          Arrival Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="arrivalAirportLng"
                          value={formData.arrivalAirportLng}
                          onChange={handleChange}
                          placeholder="e.g., -73.7781"
                          step="any"
                          className={inputStyles}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelStyles}>
                  Departure Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
                <label className={labelStyles}>
                  Departure Time (optional)
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="Leave empty if unknown"
                />
                <p className="text-xs text-gray-600 font-medium">Local departure time (leave empty if unknown)</p>
              </div>

              <div className="space-y-2">
                <label className={labelStyles}>
                  Arrival Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
                <label className={labelStyles}>
                  Arrival Time (optional)
                </label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="Leave empty if unknown"
                />
                <p className="text-xs text-gray-600 font-medium">Local arrival time (leave empty if unknown)</p>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Flight Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>
                  Flight Class
                </label>
                <select
                  name="flightClass"
                  value={formData.flightClass}
                  onChange={handleChange}
                  className={selectStyles}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>

              <div>
                <label className={labelStyles}>
                  Seat Number
                </label>
                <input
                  type="text"
                  name="seatNumber"
                  value={formData.seatNumber}
                  onChange={handleChange}
                  placeholder="e.g., 12A"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>
                  Reason
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={selectStyles}
                >
                  <option value="Leisure">Leisure</option>
                  <option value="Business">Business</option>
                  <option value="Transit">Transit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Additional Information</h3>
            
            <div>
              <label className={labelStyles}>
                Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={4}
                placeholder="Additional notes about the flight..."
                className={textareaStyles}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {isSubmitting 
                ? (editingFlight ? 'Updating Flight...' : 'Adding Flight...') 
                : (editingFlight ? 'Update Flight' : 'Add Flight')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
