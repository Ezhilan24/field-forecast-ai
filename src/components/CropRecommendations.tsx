import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CropRecommendation } from '@/lib/yieldCalculator';
import { Sprout, TrendingUp, CheckCircle2, Trophy } from 'lucide-react';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
}

const cropIcons: Record<string, string> = {
  wheat: '🌾',
  corn: '🌽',
  rice: '🍚',
  soybeans: '🫘',
  cotton: '☁️',
  barley: '🌿',
  sunflower: '🌻',
};

const cropNames: Record<string, string> = {
  wheat: 'Wheat',
  corn: 'Corn',
  rice: 'Rice',
  soybeans: 'Soybeans',
  cotton: 'Cotton',
  barley: 'Barley',
  sunflower: 'Sunflower',
};

export function CropRecommendations({ recommendations }: CropRecommendationsProps) {
  const getSuitabilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getSuitabilityLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Moderate';
    return 'Low';
  };

  return (
    <Card className="border-0 shadow-lg animate-fade-in gradient-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          Crop Recommendations
        </CardTitle>
        <CardDescription>
          Based on your field conditions, here are the best crops to grow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={rec.crop_type}
            className={`p-4 rounded-lg border bg-card transition-all hover:shadow-md ${
              index === 0 ? 'ring-2 ring-primary/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {index === 0 && (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                )}
                <span className="text-2xl">{cropIcons[rec.crop_type]}</span>
                <div>
                  <h3 className="font-semibold text-lg">
                    {cropNames[rec.crop_type]}
                    {index === 0 && (
                      <Badge className="ml-2 bg-primary/10 text-primary border-0">
                        Top Pick
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Predicted yield: <span className="font-medium text-foreground">{rec.predicted_yield.toLocaleString()} kg/acre</span>
                  </p>
                </div>
              </div>
              <Badge className={getSuitabilityColor(rec.suitability_score)}>
                {getSuitabilityLabel(rec.suitability_score)}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Suitability Score</span>
                <span className="font-medium">{Math.round(rec.suitability_score * 100)}%</span>
              </div>
              <Progress value={rec.suitability_score * 100} className="h-2" />
            </div>

            <div className="space-y-1">
              {rec.reasons.slice(0, 3).map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Recommendations are based on soil, weather, and nutrient analysis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}