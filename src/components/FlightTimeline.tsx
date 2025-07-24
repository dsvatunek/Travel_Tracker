'use client'

import React, { useEffect, useState } from 'react'

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

interface TimelineProps {
  flights: Flight[]
  startDate: Date | null
  endDate: Date | null
  onDateRangeChange: (start: Date | null, end: Date | null) => void
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function FlightTimeline({ flights, startDate, endDate, onDateRangeChange }: TimelineProps) {
  const [startMonth, setStartMonth] = useState<number>(0)
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear())
  const [endMonth, setEndMonth] = useState<number>(11)
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear())

  // Get available years from flight data
  const availableYears = React.useMemo(() => {
    if (flights.length === 0) return [new Date().getFullYear()]
    
    const years = flights.map(f => new Date(f.departureTime).getFullYear())
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years, new Date().getFullYear())
    
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
  }, [flights])

  // Initialize with flight data range
  useEffect(() => {
    if (flights.length > 0 && (!startDate || !endDate)) {
      const flightDates = flights.map(f => new Date(f.departureTime))
      const minDate = new Date(Math.min(...flightDates.map(d => d.getTime())))
      const maxDate = new Date()
      
      setStartMonth(minDate.getMonth())
      setStartYear(minDate.getFullYear())
      setEndMonth(maxDate.getMonth())
      setEndYear(maxDate.getFullYear())
      
      // Set the actual date range
      const rangeStart = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
      const rangeEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0)
      onDateRangeChange(rangeStart, rangeEnd)
    }
  }, [flights, startDate, endDate, onDateRangeChange])

  // Update date range when dropdowns change
  const handleRangeChange = () => {
    const rangeStart = new Date(startYear, startMonth, 1)
    const rangeEnd = new Date(endYear, endMonth + 1, 0) // Last day of end month
    onDateRangeChange(rangeStart, rangeEnd)
  }

  useEffect(() => {
    handleRangeChange()
  }, [startMonth, startYear, endMonth, endYear])

  // Count flights in selected range
  const flightsInRange = flights.filter(flight => {
    const flightDate = new Date(flight.departureTime)
    const rangeStart = new Date(startYear, startMonth, 1)
    const rangeEnd = new Date(endYear, endMonth + 1, 0)
    return flightDate >= rangeStart && flightDate <= rangeEnd
  }).length

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Flight Date Range</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
          <div className="flex gap-2">
            <select
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
          <div className="flex gap-2">
            <select
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
              className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-700 rounded-md">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">
            Selected Range: <span className="text-white font-medium">
              {MONTHS[startMonth]} {startYear} - {MONTHS[endMonth]} {endYear}
            </span>
          </span>
          <span className="text-blue-400 font-medium">
            {flightsInRange} flight{flightsInRange !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
