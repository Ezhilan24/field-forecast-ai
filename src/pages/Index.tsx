import { useState } from 'react';
import { Header } from '@/components/Header';
import { FieldDataForm } from '@/components/FieldDataForm';
import { PredictionResults } from '@/components/PredictionResults';
import { FieldData, PredictionResult, ValidationError, validateFieldData, calculateYield } from '@/lib/yieldCalculator';
import { useToast } from '@/hooks/use-toast';
import { Wheat, BarChart3, Zap } from 'lucide-react';

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: FieldData) => {
    setIsLoading(true);
    
    // Validate input
    const validationError = validateFieldData(data);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate processing time for better UX
    setTimeout(() => {
      const result = calculateYield(data);
      setPrediction(result);
      setIsLoading(false);
      
      toast({
        title: "Prediction Complete",
        description: `Estimated yield: ${result.predicted_yield.toLocaleString()} ${result.unit}`,
      });
    }, 800);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Precision Agriculture
            <span className="block text-primary mt-2">Yield Prediction</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage data-driven insights to optimize your crop yields. 
            Enter your field parameters and get accurate predictions with actionable recommendations.
          </p>
        </section>

        {/* Feature Pills */}
        <section className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
            <Wheat className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Multi-Crop Support</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Data Analytics</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
            <Zap className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Instant Results</span>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          <div>
            <FieldDataForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          <div>
            {prediction ? (
              <PredictionResults result={prediction} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 rounded-xl border-2 border-dashed border-border bg-card/50">
                  <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Prediction Yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Fill in your field data on the left to receive your personalized yield prediction and optimization tips.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AgroPredict. Empowering farmers with data-driven decisions.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
