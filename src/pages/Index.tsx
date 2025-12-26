import { useState } from 'react';
import { Header } from '@/components/Header';
import { FieldConditionsForm, FieldConditions } from '@/components/FieldConditionsForm';
import { CropRecommendations } from '@/components/CropRecommendations';
import { CropRecommendation, validateFieldConditions, recommendCrops } from '@/lib/yieldCalculator';
import { useToast } from '@/hooks/use-toast';
import { Wheat, BarChart3, Zap, Sprout } from 'lucide-react';

const Index = () => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: FieldConditions) => {
    setIsLoading(true);
    
    // Validate input
    const validationError = validateFieldConditions(data);
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
      const result = recommendCrops(data);
      setRecommendations(result);
      setIsLoading(false);
      
      toast({
        title: "Analysis Complete",
        description: `Top recommendation: ${result[0].crop_type} with ${Math.round(result[0].suitability_score * 100)}% suitability`,
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
            Smart Crop
            <span className="block text-primary mt-2">Recommendations</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your field conditions and let our AI analyze which crops will thrive best. 
            Get data-driven recommendations with predicted yields.
          </p>
        </section>

        {/* Feature Pills */}
        <section className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
            <Sprout className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">7 Crop Types</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
            <BarChart3 className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Suitability Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
            <Zap className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Yield Predictions</span>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          <div>
            <FieldConditionsForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          <div>
            {recommendations ? (
              <CropRecommendations recommendations={recommendations} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 rounded-xl border-2 border-dashed border-border bg-card/50">
                  <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Wheat className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Recommendations Yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Fill in your field conditions to discover which crops are best suited for your land.
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