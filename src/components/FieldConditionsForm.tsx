import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FieldConditions } from '@/lib/yieldCalculator';
import { Droplets, Thermometer, Wind, FlaskConical, MapPin } from 'lucide-react';

export type { FieldConditions } from '@/lib/yieldCalculator';

interface FieldConditionsFormProps {
  onSubmit: (data: FieldConditions) => void;
  isLoading?: boolean;
}

export function FieldConditionsForm({ onSubmit, isLoading }: FieldConditionsFormProps) {
  const [formData, setFormData] = useState<Partial<FieldConditions>>({
    season: '',
    area: undefined,
    soil_pH: undefined,
    nitrogen: undefined,
    phosphorus: undefined,
    potassium: undefined,
    rainfall: undefined,
    temperature: undefined,
    humidity: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as FieldConditions);
  };

  const handleInputChange = (field: keyof FieldConditions, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="border-0 shadow-lg gradient-card">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Field Conditions
        </CardTitle>
        <CardDescription>
          Enter your field parameters to find the best crops for your conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Season and Area */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select 
                value={formData.season} 
                onValueChange={(value) => handleInputChange('season', value)}
              >
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="monsoon">Monsoon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Field Area (acres)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                placeholder="e.g., 10"
                value={formData.area ?? ''}
                onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Soil pH */}
          <div className="space-y-2">
            <Label htmlFor="soil_pH" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-accent" />
              Soil pH
            </Label>
            <Input
              id="soil_pH"
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g., 6.8"
              value={formData.soil_pH ?? ''}
              onChange={(e) => handleInputChange('soil_pH', parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* NPK Values */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Soil Nutrients (kg/ha)</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="nitrogen" className="text-xs text-muted-foreground">Nitrogen (N)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  placeholder="e.g., 55"
                  value={formData.nitrogen ?? ''}
                  onChange={(e) => handleInputChange('nitrogen', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phosphorus" className="text-xs text-muted-foreground">Phosphorus (P)</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  placeholder="e.g., 35"
                  value={formData.phosphorus ?? ''}
                  onChange={(e) => handleInputChange('phosphorus', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium" className="text-xs text-muted-foreground">Potassium (K)</Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="e.g., 40"
                  value={formData.potassium ?? ''}
                  onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Weather Conditions</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rainfall" className="text-xs text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  Rainfall (mm)
                </Label>
                <Input
                  id="rainfall"
                  type="number"
                  placeholder="e.g., 320"
                  value={formData.rainfall ?? ''}
                  onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-xs text-muted-foreground flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="e.g., 22"
                  value={formData.temperature ?? ''}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidity" className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  Humidity (%)
                </Label>
                <Input
                  id="humidity"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 65"
                  value={formData.humidity ?? ''}
                  onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyzing...
              </span>
            ) : (
              'Find Best Crops'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}