import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RiskBadge, RiskScore } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  MapPin, 
  Bell, 
  FileText, 
  Plus, 
  Trash2, 
  Clock, 
  Building2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Settings
} from "lucide-react";
import { format } from "date-fns";

type RiskLevelType = "very_low" | "low" | "medium" | "high" | "critical";

interface Assessment {
  id: string;
  state: string;
  city: string | null;
  locality: string | null;
  property_type: string;
  risk_score: number | null;
  risk_level: RiskLevelType | null;
  assessment_date: string;
  is_saved: boolean;
}

interface AlertSubscription {
  id: string;
  alert_type: string;
  state: string | null;
  city: string | null;
  frequency: string;
  is_active: boolean;
  created_at: string;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [alerts, setAlerts] = useState<AlertSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from("property_assessments")
        .select("*")
        .order("assessment_date", { ascending: false })
        .limit(10);

      if (assessmentsError) throw assessmentsError;
      setAssessments(assessmentsData || []);

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from("alerts_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (alertsError) throw alertsError;
      setAlerts(alertsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAlertActive = async (alertId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("alerts_subscriptions")
        .update({ is_active: !currentStatus })
        .eq("id", alertId);

      if (error) throw error;
      
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_active: !currentStatus } : alert
      ));
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("alerts_subscriptions")
        .delete()
        .eq("id", alertId);

      if (error) throw error;
      
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const savedAssessments = assessments.filter(a => a.is_saved);
  const recentAssessments = assessments.slice(0, 5);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Manage your property assessments and stay updated on infrastructure projects.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assessments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedAssessments.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts.filter(a => a.is_active).length}</p>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Start New</p>
                  <p className="font-semibold">Assessment</p>
                </div>
                <Button variant="glass" size="icon" asChild>
                  <Link to="/assess">
                    <Plus className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-2">
            <TabsTrigger value="assessments" className="gap-2">
              <FileText className="h-4 w-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <MapPin className="h-4 w-4" />
              Saved Properties
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Recent Assessments Tab */}
          <TabsContent value="assessments">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Assessments</CardTitle>
                    <CardDescription>Your latest property risk assessments</CardDescription>
                  </div>
                  <Button asChild>
                    <Link to="/assess" className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Assessment
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recentAssessments.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No assessments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by checking the risk for a property you're interested in.
                    </p>
                    <Button asChild>
                      <Link to="/assess">Create Your First Assessment</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {assessment.locality || assessment.city || assessment.state}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {[assessment.city, assessment.state].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {assessment.risk_level && (
                            <RiskBadge level={assessment.risk_level} size="sm" />
                          )}
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(assessment.assessment_date), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Properties Tab */}
          <TabsContent value="saved">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>Properties you're monitoring for risk changes</CardDescription>
              </CardHeader>
              <CardContent>
                {savedAssessments.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No saved properties</h3>
                    <p className="text-muted-foreground mb-4">
                      Save properties from your assessments to monitor them.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="p-4 rounded-lg border hover:shadow-soft transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">
                              {assessment.locality || assessment.city}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {assessment.state}
                            </p>
                          </div>
                          {assessment.risk_level && (
                            <RiskBadge level={assessment.risk_level} size="sm" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="capitalize">{assessment.property_type.replace("_", " ")}</span>
                          <span>{format(new Date(assessment.assessment_date), "MMM d")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Alert Subscriptions</CardTitle>
                    <CardDescription>Get notified about new projects and risk changes</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Alert
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No alerts configured</h3>
                    <p className="text-muted-foreground mb-4">
                      Set up alerts to get notified about new infrastructure projects.
                    </p>
                    <Button variant="outline">Create Your First Alert</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            alert.is_active ? "bg-accent/10" : "bg-muted"
                          }`}>
                            <Bell className={`h-5 w-5 ${
                              alert.is_active ? "text-accent" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {alert.alert_type.replace("_", " ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {[alert.city, alert.state].filter(Boolean).join(", ") || "All locations"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="capitalize">
                            {alert.frequency.replace("_", " ")}
                          </Badge>
                          <Switch
                            checked={alert.is_active}
                            onCheckedChange={() => toggleAlertActive(alert.id, alert.is_active)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
