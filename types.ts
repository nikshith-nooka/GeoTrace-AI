
export interface TeamMember {
  name: string;
  role: string;
  contact: string;
  image: string;
}

export interface AQIData {
  location: string;
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
}

export interface PredictionPoint {
  time: string;
  aqi: number;
}

export interface Hazard {
  title: string;
  description: string;
}

export interface Facility {
  name: string;
  type: 'Hospital' | 'Clinic' | 'Park';
  lat: number;
  lng: number;
  distance?: string;
}

export interface LocationAnalysisResult {
  locationName: string;
  aqi: number;
  status: string;
  pollutants: { name: string; value: number }[];
  recommendation: string; // Used for "Overall Assessment" text
  hazards: Hazard[];
  facilities: Facility[];
  locationImageUrl?: string;
}

export interface CityHealthSnapshot {
  cityName: string;
  overallScore: number;
  highlights: string[];
  riskFactors: string[];
}
