'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface TimelineProps {
  startDate: Date
  endDate: Date
  onDateRangeChange: (start: Date, end: Date) => void
  flights: Array<{
    id: string
    departureTime: string
    arrivalTime: string
    departureAirport: { code: string }
    arrivalAirport: { code: string }
  }>
}

export default function Timeline({ startDate, endDate, onDateRangeChange, flights }: TimelineProps) {
  const [localStartDate, setLocalStartDate] = useState(format(startDate, 'yyyy-MM-dd'))
  const [localEndDate, setLocalEndDate] = useState(format(endDate, 'yyyy-MM-dd'))

  useEffect(() => {
    const start = new Date(localStartDate)
    const end = new Date(localEndDate)
    onDateRangeChange(start, end)
  }, [localStartDate, localEndDate, onDateRangeChange])

  const flightsInRange = flights.filter(flight => {
    const flightDate = new Date(flight.departureTime)
    return flightDate >= startDate && flightDate <= endDate
  })

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Travel Timeline</h3>
      
      {/* Date Range Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        <div className="text-sm text-gray-600 mb-2">
          {flightsInRange.length} flights in selected range
        </div>
        
        {/* Simple timeline */}
        <div className="space-y-2">
          {flightsInRange.map((flight) => (
            <div key={flight.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {flight.departureAirport.code} → {flight.arrivalAirport.code}
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(flight.departureTime), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {flightsInRange.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No flights in the selected date range
          </div>
        )}
      </div>
    </div>
  )
}
