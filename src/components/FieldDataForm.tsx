import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FieldData } from '@/lib/yieldCalculator';
import { Wheat, Droplets, Thermometer, Wind, Leaf, FlaskConical } from 'lucide-react';

interface FieldDataFormProps {
  onSubmit: (data: FieldData) => void;
  isLoading?: boolean;
}

export function FieldDataForm({ onSubmit, isLoading }: FieldDataFormProps) {
  const [formData, setFormData] = useState<Partial<FieldData>>({
    crop_type: undefined,
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
    onSubmit(formData as FieldData);
  };

  const handleInputChange = (field: keyof FieldData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="border-0 shadow-lg gradient-card">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Field Data Input
        </CardTitle>
        <CardDescription>
          Enter your field parameters for accurate yield prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crop Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="crop_type" className="flex items-center gap-2">
                <Wheat className="h-4 w-4 text-accent" />
                Crop Type
              </Label>
              <Select 
                value={formData.crop_type} 
                onValueChange={(value) => handleInputChange('crop_type', value as FieldData['crop_type'])}
              >
                <SelectTrigger id="crop_type">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          </div>

          {/* Area and Soil */}
          <div className="grid gap-4 md:grid-cols-2">
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
                Calculating...
              </span>
            ) : (
              'Calculate Yield Prediction'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
