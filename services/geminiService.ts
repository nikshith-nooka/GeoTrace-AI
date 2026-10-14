
import { GoogleGenAI, Type } from "@google/genai";
import { LocationAnalysisResult, CityHealthSnapshot } from "../types";

const extractJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse JSON from response:", text);
    throw new Error("Invalid response format from intelligence engine.");
  }
};

export const analyzeAirQualityImage = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "Please analyze this image for environmental pollution signs. Provide a highly detailed structured response with risk level (0-100), dominant pollutant, and a comprehensive health recommendation.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          pollutant: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          insights: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["riskScore", "pollutant", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const chatWithAI = async (message: string, history: any[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are GeoTrace Assistant, an exceptionally polite and helpful expert in air quality and environmental science. Greet users warmly. Help them understand AQI data, suggest healthy travel routes, and give tips on reducing exposure to pollution. Always maintain a professional, scientific, yet empathetic tone.",
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const geocodeLocation = async (query: string): Promise<{ lat: number, lng: number, foundLocationName: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find precise lat/lng and formal name for: "${query}". Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lat: { type: Type.NUMBER },
          lng: { type: Type.NUMBER },
          foundLocationName: { type: Type.STRING }
        },
        required: ["lat", "lng", "foundLocationName"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeLocationByCoordinates = async (lat: number, lng: number, language: string, locationName?: string): Promise<{ analysis: LocationAnalysisResult, imageUrl: string | null }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform DEEP environmental audit for [${lat}, ${lng}]${locationName ? ` (${locationName})` : ''}.
  Return JSON: 
  {
    "locationName": "formal name",
    "aqi": 0-500,
    "status": "Good/Moderate/Unhealthy/Hazardous",
    "pollutants": [{"name": "PM2.5", "value": 0-100}],
    "recommendation": "3-sentence assessment",
    "hazards": [{"title": "hazard name", "description": "why it's a risk"}],
    "facilities": [{"name": "name", "type": "Hospital/Clinic/Park", "lat": 0, "lng": 0}],
    "locationImageUrl": "satellite-style image URL"
  }
  Use Search grounding. Language: ${language}.`;
  
  // Using gemini-3-flash-preview for much faster response times as requested
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const analysis = extractJSON(response.text);
  if (!analysis.locationImageUrl || analysis.locationImageUrl.includes('placeholder')) {
     analysis.locationImageUrl = `https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop`;
  }
  return { analysis, imageUrl: analysis.locationImageUrl };
};

export const getCityHealthSnapshot = async (cityName: string, country: string, language: string): Promise<CityHealthSnapshot> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a health snapshot for ${cityName}, ${country}. Include overall health score (0-100), 5 highlights, and 3 risk factors. Return as JSON. Language: ${language}.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cityName: { type: Type.STRING },
          overallScore: { type: Type.NUMBER },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["cityName", "overallScore", "highlights", "riskFactors"]
      }
    }
  });
  return JSON.parse(response.text);
};
