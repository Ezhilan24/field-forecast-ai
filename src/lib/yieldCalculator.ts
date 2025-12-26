export interface FieldData {
  crop_type: 'wheat' | 'corn' | 'rice' | 'soybeans' | 'cotton' | 'barley' | 'sunflower';
  season: string;
  area: number;
  soil_pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  rainfall: number;
  temperature: number;
  humidity: number;
}

export interface PredictionResult {
  predicted_yield: number;
  unit: 'kg/acre' | 'tons/hectare';
  accuracy_score: number;
  optimization_suggestions: string[];
}

export interface CropRecommendation {
  crop_type: FieldData['crop_type'];
  predicted_yield: number;
  suitability_score: number;
  reasons: string[];
}

export interface FieldConditions {
  season: string;
  area: number;
  soil_pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  rainfall: number;
  temperature: number;
  humidity: number;
}

export interface ValidationError {
  error: string;
}

const BASE_YIELDS: Record<string, number> = {
  wheat: 2000,
  corn: 2500,
  rice: 1800,
  soybeans: 1200,
  cotton: 800,
  barley: 1900,
  sunflower: 1100,
};

export function validateFieldData(data: Partial<FieldData>): ValidationError | null {
  const requiredFields: (keyof FieldData)[] = [
    'crop_type', 'season', 'area', 'soil_pH', 'nitrogen', 
    'phosphorus', 'potassium', 'rainfall', 'temperature', 'humidity'
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return { error: `Missing field: ${field}` };
    }
  }

  return null;
}

export function calculateYield(data: FieldData): PredictionResult {
  const baseYield = BASE_YIELDS[data.crop_type] || 2000;
  
  let totalAdjustment = 0;

  // Soil pH adjustment
  if (data.soil_pH >= 6.5 && data.soil_pH <= 7.5) {
    totalAdjustment += 0.10;
  } else {
    totalAdjustment -= 0.05;
  }

  // Nitrogen adjustment
  if (data.nitrogen > 50) {
    totalAdjustment += (data.nitrogen - 50) * 0.002;
  } else {
    totalAdjustment -= (50 - data.nitrogen) * 0.001;
  }

  // Phosphorus adjustment
  if (data.phosphorus > 30) {
    totalAdjustment += (data.phosphorus - 30) * 0.001;
  }

  // Potassium adjustment
  if (data.potassium > 30) {
    totalAdjustment += (data.potassium - 30) * 0.001;
  }

  // Rainfall adjustment
  if (data.rainfall > 300) {
    totalAdjustment += (data.rainfall - 300) * 0.003;
  } else {
    totalAdjustment -= (300 - data.rainfall) * 0.002;
  }

  // Temperature adjustment
  if (data.temperature > 20) {
    totalAdjustment += (data.temperature - 20) * 0.002;
  } else {
    totalAdjustment -= (20 - data.temperature) * 0.003;
  }

  // Humidity adjustment
  if (data.humidity > 60) {
    totalAdjustment += (data.humidity - 60) * 0.001;
  } else {
    totalAdjustment -= (60 - data.humidity) * 0.002;
  }

  // Cap adjustment to reasonable range
  totalAdjustment = Math.max(-0.5, Math.min(1.0, totalAdjustment));

  const predictedYield = Math.round(baseYield * data.area * (1 + totalAdjustment));

  // Calculate accuracy score
  const phDeviation = Math.abs(data.soil_pH - 7) / 7;
  const tempDeviation = Math.abs(data.temperature - 20) / 20;
  const humidityDeviation = Math.abs(data.humidity - 60) / 60;
  const accuracyScore = Math.round((1 - Math.min(0.3, phDeviation + tempDeviation + humidityDeviation)) * 100) / 100;

  // Generate optimization suggestions
  const suggestions: string[] = [];

  if (data.rainfall < 200) {
    suggestions.push("Recommend drip irrigation to maintain soil moisture.");
  }
  
  if (data.nitrogen < 40) {
    suggestions.push("Apply 50 kg/ha of nitrogen fertilizer before planting.");
  }

  if (data.soil_pH < 6.5 || data.soil_pH > 7.5) {
    if (data.soil_pH < 6.5) {
      suggestions.push("Apply agricultural lime to raise soil pH to optimal range (6.5-7.5).");
    } else {
      suggestions.push("Apply sulfur to lower soil pH to optimal range (6.5-7.5).");
    }
  }

  if (data.temperature > 30) {
    suggestions.push("Use shade nets or adjust planting date to cooler period.");
  }

  if (data.crop_type === 'wheat' && data.rainfall < 250) {
    suggestions.push("Consider switching to millet or sorghum for better drought resilience.");
  }

  if (data.crop_type === 'soybeans' && data.soil_pH < 6.0) {
    suggestions.push("Soybeans prefer pH 6.0-7.0. Apply lime to raise soil pH for better nodulation.");
  }

  if (data.crop_type === 'cotton' && data.temperature < 15) {
    suggestions.push("Cotton requires warm temperatures (20-30°C). Consider delayed planting or row covers.");
  }

  if (data.crop_type === 'barley' && data.nitrogen > 80) {
    suggestions.push("Excessive nitrogen can cause lodging in barley. Reduce to 60-80 kg/ha.");
  }

  if (data.crop_type === 'sunflower' && data.humidity > 80) {
    suggestions.push("High humidity increases disease risk in sunflowers. Ensure good field drainage.");
  }

  if (data.phosphorus < 25) {
    suggestions.push("Increase phosphorus application to improve root development.");
  }

  if (data.potassium < 30) {
    suggestions.push("Add potassium fertilizer to enhance plant disease resistance.");
  }

  if (suggestions.length < 3) {
    suggestions.push("Maintain current farming practices for optimal results.");
  }

  return {
    predicted_yield: predictedYield,
    unit: 'kg/acre',
    accuracy_score: accuracyScore,
    optimization_suggestions: suggestions.slice(0, 5),
  };
}

// Crop-specific optimal conditions
const CROP_CONDITIONS: Record<string, { 
  optimalPH: [number, number]; 
  optimalTemp: [number, number]; 
  optimalRainfall: [number, number];
  optimalHumidity: [number, number];
  nitrogenNeed: 'low' | 'medium' | 'high';
}> = {
  wheat: { optimalPH: [6.0, 7.5], optimalTemp: [15, 25], optimalRainfall: [250, 500], optimalHumidity: [40, 70], nitrogenNeed: 'medium' },
  corn: { optimalPH: [5.8, 7.0], optimalTemp: [20, 30], optimalRainfall: [400, 600], optimalHumidity: [50, 80], nitrogenNeed: 'high' },
  rice: { optimalPH: [5.5, 6.5], optimalTemp: [22, 32], optimalRainfall: [500, 800], optimalHumidity: [70, 90], nitrogenNeed: 'high' },
  soybeans: { optimalPH: [6.0, 7.0], optimalTemp: [20, 30], optimalRainfall: [300, 500], optimalHumidity: [50, 75], nitrogenNeed: 'low' },
  cotton: { optimalPH: [5.8, 8.0], optimalTemp: [20, 35], optimalRainfall: [400, 700], optimalHumidity: [40, 65], nitrogenNeed: 'medium' },
  barley: { optimalPH: [6.0, 8.0], optimalTemp: [12, 22], optimalRainfall: [200, 400], optimalHumidity: [40, 65], nitrogenNeed: 'medium' },
  sunflower: { optimalPH: [6.0, 7.5], optimalTemp: [18, 28], optimalRainfall: [300, 500], optimalHumidity: [40, 70], nitrogenNeed: 'low' },
};

export function validateFieldConditions(data: Partial<FieldConditions>): ValidationError | null {
  const requiredFields: (keyof FieldConditions)[] = [
    'season', 'area', 'soil_pH', 'nitrogen', 
    'phosphorus', 'potassium', 'rainfall', 'temperature', 'humidity'
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return { error: `Missing field: ${field}` };
    }
  }

  return null;
}

export function recommendCrops(conditions: FieldConditions): CropRecommendation[] {
  const cropTypes: FieldData['crop_type'][] = ['wheat', 'corn', 'rice', 'soybeans', 'cotton', 'barley', 'sunflower'];
  
  const recommendations: CropRecommendation[] = cropTypes.map(cropType => {
    const cropConditions = CROP_CONDITIONS[cropType];
    let suitabilityScore = 1.0;
    const reasons: string[] = [];

    // pH suitability
    if (conditions.soil_pH >= cropConditions.optimalPH[0] && conditions.soil_pH <= cropConditions.optimalPH[1]) {
      suitabilityScore += 0.15;
      reasons.push(`Soil pH ${conditions.soil_pH} is ideal (optimal: ${cropConditions.optimalPH[0]}-${cropConditions.optimalPH[1]})`);
    } else {
      suitabilityScore -= 0.15;
    }

    // Temperature suitability
    if (conditions.temperature >= cropConditions.optimalTemp[0] && conditions.temperature <= cropConditions.optimalTemp[1]) {
      suitabilityScore += 0.2;
      reasons.push(`Temperature ${conditions.temperature}°C is excellent for growth`);
    } else {
      suitabilityScore -= 0.2;
    }

    // Rainfall suitability
    if (conditions.rainfall >= cropConditions.optimalRainfall[0] && conditions.rainfall <= cropConditions.optimalRainfall[1]) {
      suitabilityScore += 0.15;
      reasons.push(`Rainfall ${conditions.rainfall}mm matches water requirements`);
    } else if (conditions.rainfall < cropConditions.optimalRainfall[0]) {
      suitabilityScore -= 0.1;
    } else {
      suitabilityScore -= 0.05;
    }

    // Humidity suitability
    if (conditions.humidity >= cropConditions.optimalHumidity[0] && conditions.humidity <= cropConditions.optimalHumidity[1]) {
      suitabilityScore += 0.1;
      reasons.push(`Humidity level supports healthy crop development`);
    } else {
      suitabilityScore -= 0.1;
    }

    // Nitrogen match
    const nitrogenThresholds = { low: 40, medium: 60, high: 80 };
    const requiredN = nitrogenThresholds[cropConditions.nitrogenNeed];
    if (conditions.nitrogen >= requiredN * 0.8) {
      suitabilityScore += 0.1;
      reasons.push(`Nitrogen levels adequate for ${cropConditions.nitrogenNeed} requirement crop`);
    }

    // Phosphorus and Potassium
    if (conditions.phosphorus >= 30 && conditions.potassium >= 30) {
      suitabilityScore += 0.1;
      reasons.push('Good phosphorus and potassium levels for root and plant health');
    }

    // Normalize score
    suitabilityScore = Math.max(0.1, Math.min(1.0, suitabilityScore));

    // Calculate predicted yield
    const fieldData: FieldData = { ...conditions, crop_type: cropType };
    const prediction = calculateYield(fieldData);

    return {
      crop_type: cropType,
      predicted_yield: prediction.predicted_yield,
      suitability_score: Math.round(suitabilityScore * 100) / 100,
      reasons: reasons.length > 0 ? reasons : ['General conditions are suitable for this crop'],
    };
  });

  // Sort by suitability score descending
  return recommendations.sort((a, b) => b.suitability_score - a.suitability_score);
}
