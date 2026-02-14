import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RiskBadge, RiskScore } from "@/components/RiskBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/SearchableSelect";
import { INDIAN_LOCATIONS, PROPERTY_SIZES, State, District, City } from "@/data/locations";
import { useToast } from "@/components/ui/use-toast";
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
  FileText,
  Map as MapIcon,
} from "lucide-react";
import { INFRASTRUCTURE_PROJECTS } from "@/data/infrastructure_projects";

// Lazy load map component
const RiskZoneMap = lazy(() => import("@/components/RiskZoneMap"));

type RiskLevelType = "very_low" | "low" | "medium" | "high" | "critical";
type PropertyType = "agricultural_land" | "vacant_plot" | "independent_house" | "apartment" | "commercial" | "industrial";

interface NearbyProject {
  id: string;
  project_name: string;
  project_type: string;
  project_phase: string;
  distance_km: number;
  buffer_distance_meters: number;
  riskContribution?: number;
  coordinates?: [number, number][];
}

interface AssessmentResult {
  risk_score: number;
  risk_level: RiskLevelType;
  nearby_projects: NearbyProject[];
  recommendations: string[];
  user_coordinates?: [number, number];
}

// State coordinates for map visualization (Fallback)
const getStateCoordinates = (state: string): [number, number] => {
  const coords: Record<string, [number, number]> = {
    "Maharashtra": [19.7515, 75.7139],
    "Gujarat": [22.2587, 71.1924],
    "Karnataka": [15.3173, 75.7139],
    "Tamil Nadu": [11.1271, 78.6569],
    "Uttar Pradesh": [26.8467, 80.9462],
    "Rajasthan": [27.0238, 74.2179],
    "Madhya Pradesh": [22.9734, 78.6569],
    "Delhi": [28.7041, 77.1025],
    "West Bengal": [22.9868, 87.8550],
    "Andhra Pradesh": [15.9129, 79.7400],
    "Telangana": [18.1124, 79.0193],
    "Kerala": [10.8505, 76.2711],
    "Punjab": [31.1471, 75.3412],
    "Haryana": [29.0588, 76.0856],
    "Bihar": [25.0961, 85.3131],
    "Odisha": [20.9517, 85.0985],
  };
  return coords[state] || [20.5937, 78.9629]; // Default to India center
};

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
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  useEffect(() => {
    if (id) {
      fetchAssessment(id);
    }
  }, [id]);

  const fetchAssessment = async (assessmentId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("property_assessments")
        .select("*")
        .eq("id", assessmentId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          state: data.state,
          district: data.district || "",
          city: data.city || "",
          locality: data.locality || "",
          propertyType: data.property_type as PropertyType,
          propertySize: data.property_size?.toString() || "",
        });

        // Parse JSON fields safely
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nearbyProjects = (typeof data.nearby_projects === 'string'
          ? JSON.parse(data.nearby_projects)
          : data.nearby_projects) as NearbyProject[];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recommendations = (typeof data.recommendations === 'string'
          ? JSON.parse(data.recommendations)
          : data.recommendations) as string[];

        setResult({
          risk_score: data.risk_score || 0,
          risk_level: (data.risk_level as RiskLevelType) || "low",
          nearby_projects: nearbyProjects || [],
          recommendations: recommendations || [],
        });

        setSavedAssessmentId(data.id);
        setStep(3);
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast({
        title: "Error",
        description: "Could not load assessment details.",
        variant: "destructive",
      });
      navigate("/assess");
    } finally {
      setIsLoading(false);
    }
  };

  // Cascading Data Logic
  const selectedStateData = useMemo(() =>
    INDIAN_LOCATIONS.find(s => s.name === formData.state),
    [formData.state]);

  const districts = useMemo(() =>
    selectedStateData?.districts || [],
    [selectedStateData]);

  const selectedDistrictData = useMemo(() =>
    districts.find(d => d.name === formData.district),
    [districts, formData.district]);

  const cities = useMemo(() =>
    selectedDistrictData?.cities || [],
    [selectedDistrictData]);

  const selectedCityData = useMemo(() =>
    cities.find(c => c.name === formData.city),
    [cities, formData.city]);

  const localities = useMemo(() =>
    selectedCityData?.localities || [],
    [selectedCityData]);

  const handleStateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      state: value,
      district: "",
      city: "",
      locality: ""
    }));
  };

  const handleDistrictChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      district: value,
      city: "",
      locality: ""
    }));
  };

  const handleCityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      city: value,
      locality: ""
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Geocoding Function using OpenStreetMap Nominatim
  const fetchCoordinates = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  // Calculate distance from point P to line segment AB
  const distToSegment = (p: [number, number], v: [number, number], w: [number, number]) => {
    const l2 = (v[0] - w[0]) ** 2 + (v[1] - w[1]) ** 2;
    if (l2 === 0) return ((p[0] - v[0]) ** 2 + (p[1] - v[1]) ** 2) ** 0.5; // v == w case
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    const projectionLat = v[0] + t * (w[0] - v[0]);
    const projectionLon = v[1] + t * (w[1] - v[1]);

    // Use Haversine for the final distance from point to projection
    return calculateDistance(p[0], p[1], projectionLat, projectionLon);
  };

  // Calculate minimum distance from point to a Polyline (array of points)
  const calculateMinDistanceTopoly = (point: [number, number], poly: [number, number][]) => {
    let minDesc = Infinity;
    for (let i = 0; i < poly.length - 1; i++) {
      const d = distToSegment(point, poly[i], poly[i + 1]);
      if (d < minDesc) minDesc = d;
    }
    return minDesc;
  };

  // Calculate Haversine distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate risk using City coordinates if available, else State
  const calculateRisk = async () => {
    setIsLoading(true);
    try {
      // 1. Geocode the address
      const addressString = `${formData.locality}, ${formData.city}, ${formData.district}, ${formData.state}, India`;

      let lat: number, lon: number;
      const coords = await fetchCoordinates(addressString);

      if (coords) {
        [lat, lon] = coords;
      } else {
        // Fallback to City/State center
        if (selectedCityData && selectedCityData.lat && selectedCityData.lng) {
          lat = selectedCityData.lat;
          lon = selectedCityData.lng;
        } else {
          [lat, lon] = getStateCoordinates(formData.state);
        }
        toast({
          title: "Precise Location Not Found",
          description: "Using city/state center for estimation. Enter a more specific locality for better results.",
          variant: "default"
        });
      }

      // 2. Fetch projects (Use Hardcoded "Real" alignments)
      const detectedProjects: NearbyProject[] = INFRASTRUCTURE_PROJECTS.map(p => {
        const dist = calculateMinDistanceTopoly([lat, lon], p.coordinates);
        return {
          id: p.id,
          project_name: p.name,
          project_type: p.type,
          project_phase: p.phase,
          distance_km: dist,
          buffer_distance_meters: p.buffer,
          riskContribution: 0,
          coordinates: p.coordinates
        };
      }).filter(p => p.distance_km < 50); // Filter relevant projects within 50km

      // 3. Calculate Risk Score
      let riskScore = 10; // Base risk

      const phaseWeight: Record<string, number> = {
        land_notification: 40,
        tender_floated: 30,
        approved: 20,
        proposed: 15,
        under_construction: 25,
        completed: 5,
      };

      detectedProjects.forEach(p => {
        let impactFactor = 0;
        // Logic: closer = higher risk
        if (p.distance_km < 0.5) impactFactor = 1.5; // Critical < 500m
        else if (p.distance_km < 2.0) impactFactor = 1.0; // High < 2km
        else if (p.distance_km < 5.0) impactFactor = 0.5; // Medium < 5km

        if (impactFactor > 0) {
          const weight = phaseWeight[p.project_phase] || 10;
          const contribution = weight * impactFactor;
          p.riskContribution = Math.round(contribution);
          riskScore += contribution;
        }
      });

      riskScore = Math.min(95, Math.round(riskScore));

      const riskLevel: RiskLevelType =
        riskScore <= 20 ? "very_low" :
          riskScore <= 40 ? "low" :
            riskScore <= 60 ? "medium" :
              riskScore <= 80 ? "high" : "critical";

      // 3. Generate Recommendations
      const recommendations: string[] = [];
      if (riskScore > 60) {
        recommendations.push("High Risk Alert: Your property is in the direct influence zone of a major project.");
        recommendations.push("Visit the local revenue office to check for Section 11 notifications.");
      } else if (riskScore > 30) {
        recommendations.push("Moderate Risk: Infrastructure projects are planned nearby.");
        recommendations.push("Keep track of local news regarding project expansion.");
      } else {
        recommendations.push("Low acquisition risk detected based on current data.");
      }
      recommendations.push("Ensure property title is clear and encumbrance-free.");

      setResult({
        risk_score: riskScore,
        risk_level: riskLevel,
        nearby_projects: detectedProjects.sort((a, b) => a.distance_km - b.distance_km),
        recommendations: recommendations,
        user_coordinates: [lat, lon]
      });

      setStep(3);
    } catch (error) {
      console.error("Error calculating risk:", error);
      toast({ title: "Analysis Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const content = `
LARAS PROPERTY RISK ASSESSMENT REPORT
=====================================
Date: ${new Date().toLocaleDateString()}
Location: ${[formData.locality, formData.city, formData.district, formData.state].filter(Boolean).join(", ")}
Property Type: ${PROPERTY_TYPES.find(t => t.value === formData.propertyType)?.label}
Size: ${formData.propertySize ? formData.propertySize + ' sq.ft' : 'N/A'}

RISK SUMMARY
------------
Risk Level: ${result.risk_level.toUpperCase().replace("_", " ")}
Risk Score: ${result.risk_score}/100

NEARBY PROJECTS (${result.nearby_projects.length})
------------------
${result.nearby_projects.map(p =>
      `- ${p.project_name} (${p.project_type}): ${p.distance_km.toFixed(1)} km away [${p.project_phase}]`
    ).join('\n')}

RECOMMENDATIONS
---------------
${result.recommendations.map(r => `- ${r}`).join('\n')}

Disclaimer: This report is generated based on publicly available data and is for informational purposes only.
`.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LARAS_Risk_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
        nearby_projects: JSON.parse(JSON.stringify(result.nearby_projects)) as Json,
        recommendations: JSON.parse(JSON.stringify(result.recommendations)) as Json,
        is_saved: true,
      };
      const { data, error } = await supabase.from("property_assessments").insert([insertData]).select().single();
      if (error) throw error;
      setSavedAssessmentId(data.id);
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleSetupAlerts = async () => {
    if (!user || !result) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to set up alerts for this location.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("alerts_subscriptions")
        .insert([{
          user_id: user.id,
          alert_type: 'new_project',
          state: formData.state,
          city: formData.city || null,
          locality: formData.locality || null,
          frequency: 'weekly_summary',
          risk_threshold: 'medium_above',
          notification_channels: ["email"]
        }]);

      if (error) throw error;

      toast({
        title: "Alerts Setup Successfully",
        description: `We'll notify you about infrastructure updates in ${formData.city || formData.state}.`,
      });

    } catch (error) {
      console.error("Error setting up alerts:", error);
      toast({
        title: "Failed to Setup Alerts",
        description: "You might already be subscribed to this location.",
        variant: "destructive",
      });
    }
  };


  const canProceedToStep2 = formData.state && formData.propertyType;
  const canCalculate = formData.state && formData.propertyType;

  // Helper to determine map coordinates for display
  const getMapCoordinates = () => {
    if (selectedCityData && selectedCityData.lat && selectedCityData.lng) {
      return [selectedCityData.lat, selectedCityData.lng] as [number, number];
    }
    return getStateCoordinates(formData.state);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps UI */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                  }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded-full transition-colors ${step > s ? "bg-primary" : "bg-muted"
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
                    <CardDescription>Enter the location details to check for acquisition risks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State / UT *</Label>
                    <SearchableSelect
                      options={INDIAN_LOCATIONS.map(s => ({ value: s.name, label: s.name }))}
                      value={formData.state}
                      onChange={handleStateChange}
                      placeholder="Select / search state"
                      searchPlaceholder="Search state..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <SearchableSelect
                      options={districts.map(d => ({ value: d.name, label: d.name }))}
                      value={formData.district}
                      onChange={handleDistrictChange}
                      placeholder="Select / search district"
                      searchPlaceholder="Search district..."
                      disabled={!formData.state}
                      emptyMessage={!formData.state ? "Select state first" : "No district found"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Town</Label>
                    <SearchableSelect
                      options={cities.map(c => ({ value: c.name, label: c.name }))}
                      value={formData.city}
                      onChange={handleCityChange}
                      placeholder="Select / search city"
                      searchPlaceholder="Search city..."
                      disabled={!formData.district}
                      emptyMessage={!formData.district ? "Select district first" : "No city found"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality / Area</Label>
                    <div className="relative">
                      {localities.length > 0 ? (
                        <SearchableSelect
                          options={localities.map(l => ({ value: l, label: l }))}
                          value={formData.locality}
                          onChange={(val) => handleInputChange("locality", val)}
                          placeholder="Select / search locality"
                          searchPlaceholder="Search locality..."
                          disabled={!formData.city}
                        />
                      ) : (
                        <div className="relative">
                          <Input
                            id="locality"
                            placeholder="Enter locality / area name"
                            value={formData.locality}
                            onChange={(e) => handleInputChange("locality", e.target.value)}
                            disabled={!formData.state}
                          />
                          {!formData.city && formData.state && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Tip: Select specific city for area suggestions
                            </p>
                          )}
                        </div>
                      )}
                    </div>
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
                          <SelectValue placeholder="Select type" />
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
                      <Label htmlFor="propertySize">Property Size</Label>
                      <div className="relative">
                        <SearchableSelect
                          options={PROPERTY_SIZES}
                          value={formData.propertySize}
                          onChange={(val) => handleInputChange("propertySize", val)}
                          placeholder="Select common size or type"
                          searchPlaceholder="Search size (e.g. 1200)"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        Don't see your size?
                        <Button
                          variant="link"
                          className="p-0 h-auto ml-1"
                          onClick={() => {
                            const size = prompt("Enter custom property size (sq.ft):");
                            if (size && !isNaN(parseFloat(size))) handleInputChange("propertySize", size);
                          }}
                        >
                          Enter manually
                        </Button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="ghost" onClick={() => setFormData({ state: "", district: "", city: "", locality: "", propertyType: "", propertySize: "" })}>Reset</Button>
                  <Button size="lg" disabled={!canProceedToStep2} onClick={() => setStep(2)} className="gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
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
                    <span className="font-medium text-right ml-4">
                      {[formData.locality, formData.city, formData.district, formData.state].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium capitalize">
                      {PROPERTY_TYPES.find(t => t.value === formData.propertyType)?.label}
                    </span>
                  </div>
                  {formData.propertySize && (
                    <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="font-medium">{formData.propertySize} sq.ft</span></div>
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
                  <Button variant="outline" onClick={() => setStep(1)}>Go Back</Button>
                  <Button size="lg" className="flex-1 gap-2" disabled={!canCalculate || isLoading} onClick={calculateRisk}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</> : <>Calculate Risk Score <ArrowRight className="h-4 w-4" /></>}
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
                <div className={`p-6 text-center ${result.risk_level === "very_low" || result.risk_level === "low"
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
                      <Button variant="outline" className="gap-2" onClick={saveAssessment} disabled={isSaving || !user}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {user ? "Save to Dashboard" : "Sign in to Save"}
                      </Button>
                    ) : (
                      <Button variant="outline" className="gap-2" disabled><CheckCircle className="h-4 w-4 text-success" />Saved</Button>
                    )}
                    <Button variant="outline" className="gap-2" onClick={handleSetupAlerts}><Bell className="h-4 w-4" />Set Up Alerts</Button>
                    <Button variant="outline" className="gap-2" onClick={handleDownloadReport}><FileText className="h-4 w-4" />Download Report</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Zone Map - Updated to use correct Coords */}
              <Card className="shadow-soft overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapIcon className="h-5 w-5" />Risk Zone Visualization</CardTitle>
                  <CardDescription>Interactive map showing your property and nearby infrastructure projects</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ErrorBoundary name="RiskZoneMap">
                    <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-muted/20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                      <RiskZoneMap
                        latitude={result.user_coordinates ? result.user_coordinates[0] : getMapCoordinates()[0]}
                        longitude={result.user_coordinates ? result.user_coordinates[1] : getMapCoordinates()[1]}
                        riskLevel={result.risk_level}
                        riskScore={result.risk_score}
                        nearbyProjects={result.nearby_projects.map(p => ({
                          id: p.id,
                          name: p.project_name,
                          type: p.project_type,
                          phase: p.project_phase,
                          distance: p.distance_km,
                          riskContribution: p.riskContribution || 0,
                          coordinates: p.coordinates
                        }))}
                        height="400px"
                      />
                    </Suspense>
                  </ErrorBoundary>
                </CardContent>
              </Card>

              {/* Nearby Projects */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Nearby Infrastructure Projects</CardTitle>
                  <CardDescription>{result.nearby_projects.length > 0 ? `Found ${result.nearby_projects.length} project(s) near this location` : "No active projects found near this location"}</CardDescription>
                </CardHeader>
                <CardContent>
                  {result.nearby_projects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" /><p>No infrastructure projects found in this area</p></div>
                  ) : (
                    <div className="space-y-3">
                      {result.nearby_projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">{project.project_name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{project.project_type.replace("_", " ")} • {project.project_phase.replace("_", " ")}</p>
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
                <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Recommendations</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" /><span>{rec}</span></li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Start New */}
              <div className="text-center">
                <Button variant="outline" onClick={() => {
                  navigate("/assess");
                  setStep(1); setResult(null); setSavedAssessmentId(null);
                  setFormData({ state: "", district: "", city: "", locality: "", propertyType: "", propertySize: "" });
                }}>Start New Assessment</Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
