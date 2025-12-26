import { PredictionResult } from '@/lib/yieldCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Lightbulb, CheckCircle2 } from 'lucide-react';

interface PredictionResultsProps {
  result: PredictionResult;
}

export function PredictionResults({ result }: PredictionResultsProps) {
  const accuracyPercentage = Math.round(result.accuracy_score * 100);
  
  const getAccuracyColor = () => {
    if (accuracyPercentage >= 90) return 'bg-success text-success-foreground';
    if (accuracyPercentage >= 75) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getAccuracyLabel = () => {
    if (accuracyPercentage >= 90) return 'Excellent';
    if (accuracyPercentage >= 75) return 'Good';
    return 'Fair';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main Yield Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Predicted Yield</p>
              <p className="text-4xl font-bold mt-1">
                {result.predicted_yield.toLocaleString()}
              </p>
              <p className="text-sm opacity-80 mt-1">{result.unit}</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
      </Card>

      {/* Accuracy Card */}
      <Card className="border-0 shadow-md gradient-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Prediction Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-bold">{accuracyPercentage}%</span>
            <Badge className={getAccuracyColor()}>
              {getAccuracyLabel()}
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${accuracyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on optimal growing conditions alignment
          </p>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="border-0 shadow-md gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.optimization_suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                className="flex gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
