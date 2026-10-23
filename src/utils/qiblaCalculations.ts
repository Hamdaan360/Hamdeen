// Kaaba coordinates in Makkah al-Mukarramah, Saudi Arabia
export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates the exact Qibla bearing (in degrees from True North clockwise 0-360)
 * using the great-circle forward azimuth formula on the spherical earth model.
 */
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const phiK = toRadians(KAABA_COORDINATES.latitude);
  const lambdaK = toRadians(KAABA_COORDINATES.longitude);
  const phi = toRadians(userLat);
  const lambda = toRadians(userLng);

  const deltaLambda = lambdaK - lambda;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

  let qibla = toDegrees(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;

  return Math.round(qibla * 10) / 10;
}

/**
 * Calculates great-circle distance to the Kaaba in kilometers (Haversine formula)
 */
export function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(KAABA_COORDINATES.latitude - userLat);
  const dLon = toRadians(KAABA_COORDINATES.longitude - userLng);
  const lat1 = toRadians(userLat);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function getCardinalDirection(degrees: number): string {
  const cardinals = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'
  ];
  const index = Math.round((degrees % 360) / 22.5);
  return cardinals[index];
}
