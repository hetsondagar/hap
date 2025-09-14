// Geospatial utility functions for location-based queries

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

// Convert degrees to radians
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Create GeoJSON point
const createGeoJSONPoint = (longitude, latitude) => {
  return {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
};

// Create bounding box for location search
const createBoundingBox = (centerLat, centerLon, radiusKm) => {
  const latDelta = radiusKm / 111; // Approximate km per degree latitude
  const lonDelta = radiusKm / (111 * Math.cos(toRadians(centerLat))); // Approximate km per degree longitude
  
  return {
    minLat: centerLat - latDelta,
    maxLat: centerLat + latDelta,
    minLon: centerLon - lonDelta,
    maxLon: centerLon + lonDelta
  };
};

// Validate coordinates
const validateCoordinates = (lat, lon) => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
};

// Get nearby events using MongoDB geospatial query
const getNearbyEventsQuery = (lat, lon, radiusKm = 10) => {
  return {
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    }
  };
};

// Calculate event density in an area
const calculateEventDensity = (events, areaKm2) => {
  return events.length / areaKm2;
};

// Get popular locations based on event count
const getPopularLocations = (events, limit = 10) => {
  const locationCounts = {};
  
  events.forEach(event => {
    const location = event.location.name;
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });
  
  return Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Filter events by category and location
const filterEventsByCategoryAndLocation = (events, category, lat, lon, radiusKm) => {
  return events.filter(event => {
    // Category filter
    if (category && event.category !== category) {
      return false;
    }
    
    // Location filter
    if (lat && lon && radiusKm) {
      const distance = calculateDistance(
        lat, lon,
        event.location.coordinates.coordinates[1],
        event.location.coordinates.coordinates[0]
      );
      return distance <= radiusKm;
    }
    
    return true;
  });
};

// Get events within date range
const filterEventsByDateRange = (events, startDate, endDate) => {
  return events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
  });
};

// Sort events by distance from a point
const sortEventsByDistance = (events, lat, lon) => {
  return events.map(event => {
    const distance = calculateDistance(
      lat, lon,
      event.location.coordinates.coordinates[1],
      event.location.coordinates.coordinates[0]
    );
    return { ...event, distance };
  }).sort((a, b) => a.distance - b.distance);
};

module.exports = {
  calculateDistance,
  toRadians,
  createGeoJSONPoint,
  createBoundingBox,
  validateCoordinates,
  getNearbyEventsQuery,
  calculateEventDensity,
  getPopularLocations,
  filterEventsByCategoryAndLocation,
  filterEventsByDateRange,
  sortEventsByDistance
};
