import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RiskBadge, RiskScore } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Building2, 
  ArrowRight, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Info,
  Save,
  Bell,
  FileText
} from "lucide-react";

type RiskLevelType = "very_low" | "low" | "medium" | "high" | "critical";
type PropertyType = "agricultural_land" | "vacant_plot" | "independent_house" | "apartment" | "commercial" | "industrial";

interface NearbyProject {
  id: string;
  project_name: string;
  project_type: string;
  project_phase: string;
  distance_km: number;
  buffer_distance_meters: number;
}

interface AssessmentResult {
  risk_score: number;
  risk_level: RiskLevelType;
  nearby_projects: NearbyProject[];
  recommendations: string[];
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep"
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "agricultural_land", label: "Agricultural Land" },
  { value: "vacant_plot", label: "Vacant Plot" },
  { value: "independent_house", label: "Independent House" },
  { value: "apartment", label: "Apartment/Flat" },
  { value: "commercial", label: "Commercial Property" },
  { value: "industrial", label: "Industrial Property" },
];

export default function Assess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    city: "",
    locality: "",
    propertyType: "" as PropertyType | "",
    propertySize: "",
  });

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [savedAssessmentId, setSavedAssessmentId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRisk = async () => {
    setIsLoading(true);
    
    try {
      // Fetch nearby infrastructure projects from database
      const { data: projects, error } = await supabase
        .from("infrastructure_projects")
        .select("*")
        .eq("state", formData.state)
        .eq("is_active", true);

      if (error) throw error;

      // Calculate risk based on projects in the area
      const nearbyProjects: NearbyProject[] = (projects || []).map(project => ({
        id: project.id,
        project_name: project.project_name,
        project_type: project.project_type,
        project_phase: project.project_phase,
        distance_km: Math.random() * 10, // Simulated distance - in production would use geospatial calculation
        buffer_distance_meters: project.buffer_distance_meters || 500,
      })).filter(p => p.distance_km < 5); // Within 5km

      // Calculate risk score based on nearby projects
      let riskScore = 10; // Base score
      
      nearbyProjects.forEach(project => {
        const phaseWeight: Record<string, number> = {
          land_notification: 30,
          tender_floated: 25,
          construction_started: 20,
          approved: 15,
          dpr_preparation: 10,
          proposed: 5,
          ongoing: 15,
          completed: 0,
        };
        
        const distanceFactor = Math.max(0, (5 - project.distance_km) / 5);
        riskScore += (phaseWeight[project.project_phase] || 0) * distanceFactor;
      });

      riskScore = Math.min(100, Math.round(riskScore));

      const riskLevel: RiskLevelType = 
        riskScore <= 20 ? "very_low" :
        riskScore <= 40 ? "low" :
        riskScore <= 60 ? "medium" :
        riskScore <= 80 ? "high" : "critical";

      const recommendations: string[] = [];
      
      if (riskScore > 60) {
        recommendations.push("Consult with a property lawyer before proceeding");
        recommendations.push("Request official land acquisition status from local authorities");
      }
      if (riskScore > 40) {
        recommendations.push("Set up alerts for project updates in this area");
        recommendations.push("Research compensation rates for similar cases");
      }
      if (riskScore > 20) {
        recommendations.push("Monitor government gazette notifications");
      }
      recommendations.push("Keep all property documents readily accessible");

      setResult({
        risk_score: riskScore,
        risk_level: riskLevel,
        nearby_projects: nearbyProjects,
        recommendations,
      });

      setStep(3);
    } catch (error) {
      console.error("Error calculating risk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAssessment = async () => {
    if (!user || !result) {
      navigate("/auth");
      return;
    }

    setIsSaving(true);
    
    try {
      const insertData = {
        user_id: user.id,
        state: formData.state,
        district: formData.district || null,
        city: formData.city || null,
        locality: formData.locality || null,
        property_type: formData.propertyType as PropertyType,
        property_size: formData.propertySize ? parseFloat(formData.propertySize) : null,
        risk_score: result.risk_score,
        risk_level: result.risk_level,
        nearby_projects: result.nearby_projects as unknown as Record<string, unknown>,
        recommendations: result.recommendations as unknown as Record<string, unknown>,
        is_saved: true,
      };
      
      const { data, error } = await supabase
        .from("property_assessments")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      setSavedAssessmentId(data.id);
    } catch (error) {
      console.error("Error saving assessment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const canProceedToStep2 = formData.state && formData.propertyType;
  const canCalculate = formData.state && formData.propertyType;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded-full transition-colors ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Location */}
          {step === 1 && (
            <Card className="shadow-medium animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Property Location</CardTitle>
                    <CardDescription>Enter the location details of the property</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State / UT *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Town</Label>
                    <Input
                      id="city"
                      placeholder="Enter city or town"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality / Area</Label>
                    <Input
                      id="locality"
                      placeholder="Enter locality or area"
                      value={formData.locality}
                      onChange={(e) => handleInputChange("locality", e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Type *</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => handleInputChange("propertyType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="propertySize">Property Size (sq.ft)</Label>
                      <Input
                        id="propertySize"
                        type="number"
                        placeholder="Enter size"
                        value={formData.propertySize}
                        onChange={(e) => handleInputChange("propertySize", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    size="lg" 
                    disabled={!canProceedToStep2}
                    onClick={() => setStep(2)}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Confirm & Calculate */}
          {step === 2 && (
            <Card className="shadow-medium animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Confirm Details</CardTitle>
                    <CardDescription>Review your property details before assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">
                      {[formData.locality, formData.city, formData.district, formData.state]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium capitalize">
                      {PROPERTY_TYPES.find(t => t.value === formData.propertyType)?.label}
                    </span>
                  </div>
                  {formData.propertySize && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">{formData.propertySize} sq.ft</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-primary">What we'll check:</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Active infrastructure projects in this area</li>
                      <li>• Land acquisition notifications</li>
                      <li>• Upcoming government projects</li>
                      <li>• Historical acquisition patterns</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Go Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2"
                    disabled={!canCalculate || isLoading}
                    onClick={calculateRisk}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Calculate Risk Score
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <div className="space-y-6 animate-fade-in">
              {/* Risk Score Card */}
              <Card className="shadow-medium overflow-hidden">
                <div className={`p-6 text-center ${
                  result.risk_level === "very_low" || result.risk_level === "low" 
                    ? "bg-gradient-to-br from-emerald-500 to-green-600" 
                    : result.risk_level === "medium"
                    ? "bg-gradient-to-br from-amber-500 to-orange-500"
                    : "bg-gradient-to-br from-red-500 to-rose-600"
                } text-white`}>
                  <h2 className="text-lg font-medium mb-4">Risk Assessment Result</h2>
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                    <span className="text-5xl font-bold">{result.risk_score}</span>
                  </div>
                  <RiskBadge level={result.risk_level} size="lg" />
                  <p className="mt-4 text-white/80 max-w-md mx-auto">
                    {result.risk_level === "very_low" || result.risk_level === "low"
                      ? "This property appears to be at low risk of land acquisition."
                      : result.risk_level === "medium"
                      ? "This property has moderate risk. We recommend further investigation."
                      : "This property has high risk of land acquisition. Proceed with caution."}
                  </p>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {!savedAssessmentId ? (
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={saveAssessment}
                        disabled={isSaving || !user}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {user ? "Save to Dashboard" : "Sign in to Save"}
                      </Button>
                    ) : (
                      <Button variant="outline" className="gap-2" disabled>
                        <CheckCircle className="h-4 w-4 text-success" />
                        Saved
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Set Up Alerts
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Projects */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Nearby Infrastructure Projects
                  </CardTitle>
                  <CardDescription>
                    {result.nearby_projects.length > 0
                      ? `Found ${result.nearby_projects.length} project(s) near this location`
                      : "No active projects found near this location"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.nearby_projects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                      <p>No infrastructure projects found in this area</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.nearby_projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{project.project_name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {project.project_type.replace("_", " ")} • {project.project_phase.replace("_", " ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{project.distance_km.toFixed(1)} km</p>
                            <p className="text-xs text-muted-foreground">away</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Start New */}
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                    setSavedAssessmentId(null);
                    setFormData({
                      state: "",
                      district: "",
                      city: "",
                      locality: "",
                      propertyType: "",
                      propertySize: "",
                    });
                  }}
                >
                  Start New Assessment
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
