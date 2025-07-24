// Map Configuration File
// Customize all visual elements of the travel tracker map

export const mapConfig = {
  // Map Settings
  map: {
    center: [20, 0] as [number, number],
    zoom: 2,
    backgroundColor: '#374151',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    noWrap: true,
    worldCopyJump: false,
    maxBounds: [[-85, -180], [85, 180]] as [[number, number], [number, number]],
    maxBoundsViscosity: 1.0
  },

  // Flight Path Settings
  flightPaths: {
    color: '#c51edcff', // Main green color (removed alpha)
    outlineColor: '#c51edcff', // Brighter green outline (removed alpha)
    weight: 2,
    outlineWeight: 3, // weight + 1
    opacity: 0.9,
    outlineOpacity: 0.63, // opacity * 0.7
    steps: 2000 // Geodesic line smoothness
  },

  // Airport Marker Settings
  airports: {
    fillColor: '#c51edcff', // Same green as flight paths
    borderColor: '#c51edcff', // Brighter green border
    size: 12,
    borderWidth: 2,
    glowColor: 'rgba(105, 246, 92, 0.6)',
    iconSize: [16, 16] as [number, number],
    iconAnchor: [8, 8] as [number, number]
  },

  // Country Boundaries Settings
  countries: {
    visited: {
      fillColor: '#10b981', // Light green fill
      borderColor: '#ffffff', // White outline
      fillOpacity: 0.2,
      borderWeight: 1,
      borderOpacity: 0.8
    },
    unvisited: {
      // Completely transparent (invisible)
      fillColor: 'transparent',
      borderColor: 'transparent',
      fillOpacity: 0,
      borderWeight: 0,
      borderOpacity: 0
    }
  },

  // Country Name Normalization
  countryAliases: {
    'usa': 'united states of america',
    'us': 'united states of america', 
    'uk': 'united kingdom',
    'uae': 'united arab emirates'
  }
}

// Helper function to get normalized country name
export function normalizeCountryName(name: string): string {
  const normalized = name.toLowerCase()
  return mapConfig.countryAliases[normalized as keyof typeof mapConfig.countryAliases] || normalized
}
