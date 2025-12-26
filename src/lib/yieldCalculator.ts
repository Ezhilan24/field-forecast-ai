export interface FieldData {
  crop_type: 'wheat' | 'corn' | 'rice';
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

export interface ValidationError {
  error: string;
}

const BASE_YIELDS: Record<string, number> = {
  wheat: 2000,
  corn: 2500,
  rice: 1800,
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
