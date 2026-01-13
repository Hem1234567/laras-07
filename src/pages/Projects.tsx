import { useState, lazy, Suspense, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealtimeProjects } from "@/hooks/useRealtimeProjects";
import { 
  Search, 
  Building2, 
  Train, 
  Plane, 
  Factory,
  MapPin,
  Calendar,
  IndianRupee,
  Loader2,
  AlertCircle,
  ExternalLink,
  Map as MapIcon,
  List,
  RefreshCw,
  Wifi
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Lazy load map component to improve initial page load
const ProjectMap = lazy(() => import("@/components/ProjectMap"));

interface Project {
  id: string;
  project_name: string;
  project_code: string | null;
  project_type: string;
  implementing_agency: string | null;
  state: string;
  districts_covered: string[];
  project_phase: string;
  notification_date: string | null;
  expected_completion_date: string | null;
  budget_crores: number | null;
  land_required_hectares: number | null;
  alignment_geojson: any | null;
  buffer_distance_meters: number | null;
}

const PROJECT_TYPE_ICONS: Record<string, typeof Building2> = {
  highway: Building2,
  metro: Train,
  railway: Train,
  airport: Plane,
  industrial: Factory,
  smart_city: Building2,
  port: Building2,
  power_plant: Factory,
};

const PROJECT_PHASES = [
  { value: "all", label: "All Phases" },
  { value: "proposed", label: "Proposed" },
  { value: "feasibility_study", label: "Feasibility Study" },
  { value: "dpr_preparation", label: "DPR Preparation" },
  { value: "approved", label: "Approved" },
  { value: "land_notification", label: "Land Notification" },
  { value: "tender_floated", label: "Tender Floated" },
  { value: "construction_started", label: "Construction Started" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

const PROJECT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "highway", label: "Highway" },
  { value: "metro", label: "Metro" },
  { value: "railway", label: "Railway" },
  { value: "airport", label: "Airport" },
  { value: "industrial", label: "Industrial" },
  { value: "smart_city", label: "Smart City" },
  { value: "port", label: "Port" },
  { value: "power_plant", label: "Power Plant" },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Use realtime hook for live updates
  const { 
    projects, 
    isLoading, 
    lastUpdate,
    refetch 
  } = useRealtimeProjects({
    enabled: true,
    filters: {
      type: selectedType,
      phase: selectedPhase,
      state: selectedState,
    },
  });

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      proposed: "bg-slate-100 text-slate-800",
      feasibility_study: "bg-blue-100 text-blue-800",
      dpr_preparation: "bg-indigo-100 text-indigo-800",
      approved: "bg-purple-100 text-purple-800",
      land_notification: "bg-amber-100 text-amber-800",
      tender_floated: "bg-orange-100 text-orange-800",
      construction_started: "bg-cyan-100 text-cyan-800",
      ongoing: "bg-emerald-100 text-emerald-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[phase] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Page Header with Realtime Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Infrastructure Projects</h1>
            <p className="text-muted-foreground">
              Browse and search government infrastructure projects across India that may affect land acquisition.
            </p>
          </div>
          
          {/* Realtime Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <Wifi className="h-3.5 w-3.5 text-success animate-pulse" />
              <span className="text-xs font-medium text-success">Live Updates</span>
            </div>
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={refetch}
              className="h-8 w-8"
              title="Refresh projects"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-soft mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by name or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_PHASES.map((phase) => (
                    <SelectItem key={phase.value} value={phase.value}>
                      {phase.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle and Map */}
        <div className="mb-6">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
              <p className="text-sm text-muted-foreground">
                {filteredProjects.length} projects found
              </p>
            </div>
            
            <TabsContent value="map" className="mt-0">
              <Suspense fallback={
                <Card className="shadow-soft overflow-hidden">
                  <div className="h-[500px] flex items-center justify-center bg-muted/20">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                </Card>
              }>
                <ProjectMap
                  projects={filteredProjects}
                  selectedProjectId={selectedProjectId}
                  onProjectSelect={(project) => {
                    setSelectedProjectId(project.id);
                  }}
                  height="500px"
                />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              {/* Projects list will be shown below */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Projects List */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>
                  {isLoading ? "Loading..." : `${filteredProjects.length} projects found`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  {projects.length === 0 
                    ? "No infrastructure projects have been added yet. Projects will appear here once data is populated."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const Icon = PROJECT_TYPE_ICONS[project.project_type] || Building2;
                  
                  return (
                    <div
                      key={project.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-soft transition-all group"
                    >
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {project.project_name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {project.state}
                              {project.districts_covered?.length > 0 && (
                                <span> • {project.districts_covered.slice(0, 2).join(", ")}</span>
                              )}
                            </p>
                          </div>
                          <Badge className={getPhaseColor(project.project_phase)}>
                            {project.project_phase.replace("_", " ")}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="capitalize flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {project.project_type.replace("_", " ")}
                          </span>
                          {project.implementing_agency && (
                            <span>{project.implementing_agency}</span>
                          )}
                          {project.notification_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(project.notification_date), "MMM yyyy")}
                            </span>
                          )}
                          {project.budget_crores && (
                            <span className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {project.budget_crores.toLocaleString()} Cr
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
