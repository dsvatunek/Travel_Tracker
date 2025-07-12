'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Plane, Calendar, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AdminPanel from '@/components/AdminPanel'

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

export default function AdminPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)

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

  const handleFlightAdded = () => {
    fetchFlights()
    setShowAddForm(false)
    setEditingFlight(null)
  }

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight)
    setShowAddForm(true)
  }

  const handleDelete = async (flightId: string) => {
    if (!confirm('Are you sure you want to delete this flight?')) {
      return
    }

    try {
      const response = await fetch(`/api/flights/${flightId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchFlights() // Refresh the list
      } else {
        alert('Failed to delete flight')
      }
    } catch (error) {
      console.error('Error deleting flight:', error)
      alert('Error deleting flight')
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (departureTime: string, arrivalTime: string) => {
    const departure = new Date(departureTime)
    const arrival = new Date(arrivalTime)
    const duration = arrival.getTime() - departure.getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Map
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flight Management</h1>
              <p className="text-gray-600">Manage your flight records</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Flight
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Flights</p>
                <p className="text-xl font-bold text-gray-900">{flights.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Airports</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Set([...flights.map(f => f.departureAirport.code), ...flights.map(f => f.arrivalAirport.code)]).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">This Year</p>
                <p className="text-xl font-bold text-gray-900">
                  {flights.filter(f => new Date(f.departureTime).getFullYear() === new Date().getFullYear()).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Set([...flights.map(f => f.departureAirport.country), ...flights.map(f => f.arrivalAirport.country)]).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flights List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Flight History</h2>
          </div>
          
          {flights.length === 0 ? (
            <div className="p-8 text-center">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No flights yet</h3>
              <p className="text-gray-600 mb-4">Start tracking your travels by adding your first flight.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Flight
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {flight.flightNumber || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{flight.airline}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {flight.departureAirport.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {flight.departureAirport.city}
                            </div>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {flight.arrivalAirport.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {flight.arrivalAirport.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(flight.departureTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDuration(flight.departureTime, flight.arrivalTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{flight.flightClass}</div>
                          <div className="text-xs text-gray-500">
                            {flight.seatNumber && `Seat ${flight.seatNumber}`}
                            {flight.aircraftRegistration && (
                              <div className="text-xs text-blue-600 font-mono">
                                {flight.aircraftRegistration}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(flight)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="Edit flight"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(flight.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            title="Delete flight"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Flight Modal */}
      {showAddForm && (
        <AdminPanel 
          onFlightAdded={handleFlightAdded} 
          onClose={() => {
            setShowAddForm(false)
            setEditingFlight(null)
          }}
          editingFlight={editingFlight}
        />
      )}
    </div>
  )
}
