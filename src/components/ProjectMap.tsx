import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Train, Plane, Factory, MapPin, ExternalLink } from "lucide-react";

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Project {
  id: string;
  project_name: string;
  project_code: string | null;
  project_type: string;
  project_phase: string;
  state: string;
  districts_covered: string[];
  budget_crores: number | null;
  alignment_geojson: any | null;
  buffer_distance_meters: number | null;
}

interface ProjectMapProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  selectedProjectId?: string;
  height?: string;
}

// Custom marker icons for different project types
const createProjectIcon = (type: string, isSelected: boolean = false) => {
  const colors: Record<string, string> = {
    highway: "#f59e0b",
    metro: "#8b5cf6",
    railway: "#3b82f6",
    airport: "#06b6d4",
    industrial: "#64748b",
    smart_city: "#10b981",
    port: "#0ea5e9",
    power_plant: "#ef4444",
  };

  const color = colors[type] || "#6b7280";
  const size = isSelected ? 40 : 30;

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        ${isSelected ? 'animation: pulse 1.5s infinite;' : ''}
      ">
        <div style="transform: rotate(45deg); color: white; font-size: ${isSelected ? '16px' : '12px'};">
          ${getIconSvg(type)}
        </div>
      </div>
    `,
    className: "custom-project-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const getIconSvg = (type: string) => {
  const icons: Record<string, string> = {
    highway: "🛣️",
    metro: "🚇",
    railway: "🚂",
    airport: "✈️",
    industrial: "🏭",
    smart_city: "🏙️",
    port: "⚓",
    power_plant: "⚡",
  };
  return icons[type] || "📍";
};

// Generate sample coordinates for Indian states
const getStateCoordinates = (state: string): [number, number] => {
  const stateCoords: Record<string, [number, number]> = {
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
    "Jharkhand": [23.6102, 85.2799],
    "Chhattisgarh": [21.2787, 81.8661],
    "Assam": [26.2006, 92.9376],
    "Goa": [15.2993, 74.1240],
  };

  // Add some randomness to prevent overlapping markers
  const base = stateCoords[state] || [20.5937, 78.9629];
  return [
    base[0] + (Math.random() - 0.5) * 2,
    base[1] + (Math.random() - 0.5) * 2,
  ];
};

// Component to recenter map when selected project changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 8, { duration: 1 });
  }, [center, map]);
  return null;
}

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

const getRiskZoneColor = (phase: string) => {
  if (["land_notification", "tender_floated", "construction_started"].includes(phase)) {
    return { color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.15 }; // Critical
  }
  if (["approved", "ongoing"].includes(phase)) {
    return { color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.12 }; // High
  }
  if (["dpr_preparation", "feasibility_study"].includes(phase)) {
    return { color: "#eab308", fillColor: "#eab308", fillOpacity: 0.1 }; // Medium
  }
  return { color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.08 }; // Low
};

// Hardcoded alignment data for specific projects to show "Real" lines
// This overrides the simple point data from the database for visual demonstration
const PROJECT_ALIGNMENTS: Record<string, [number, number][]> = {
  // Mumbai Trans Harbour Link (MTHL-01) - Actual bridge path
  "MTHL-01": [
    [18.9986, 72.8569], // Sewri
    [18.9910, 72.8800],
    [18.9800, 72.9200],
    [18.9680, 72.9500],
    [18.9550, 72.9800],
    [18.9480, 73.0030], // Chirle
  ],
  // Chennai Metro Phase 2 (CMRL-PH2) - Approximate Corridor 3 & 5
  "CMRL-PH2": [
    [13.1537, 80.2319], // Madhavaram
    [13.0827, 80.2707], // Central
    [13.0400, 80.2600], // Mylapore
    [12.9904, 80.2173], // Alandur
    [12.9500, 80.2000],
    [12.8340, 80.2223], // Sholinganallur
    [12.7874, 80.2222], // SIPCOT
  ],
  // Delhi-Mumbai Expressway (DME-01) - Simplified path
  "DME-01": [
    [28.2800, 77.0700], // Sohna / NCR
    [27.5000, 76.5000],
    [26.9100, 75.7800], // Jaipur
    [25.1800, 75.8300], // Kota
    [23.1800, 75.7700],
    [22.3000, 73.1800], // Vadodara
    [21.1700, 72.8300], // Surat
    [19.2100, 72.9700], // Virar / Mumbai
  ],
  // Mumbai-Ahmedabad Bullet Train (MAHSR-BULLET)
  "MAHSR-BULLET": [
    [23.0225, 72.5714], // Ahmedabad
    [22.3072, 73.1812], // Vadodara
    [21.1702, 72.8311], // Surat
    [20.3893, 72.9106], // Vapi
    [19.0760, 72.8777], // Mumbai BKC
  ],
  // Bangalore Suburban Rail (BSRP-KA)
  "BSRP-KA": [
    [13.2000, 77.5000],
    [12.9716, 77.5946], // Majestic
    [12.8500, 77.6500], // Electronics City
  ]
};

export function ProjectMap({
  projects,
  onProjectSelect,
  selectedProjectId,
  height = "400px"
}: ProjectMapProps) {
  const [projectCoords, setProjectCoords] = useState<Record<string, [number, number]>>({});
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);

  // Generate coordinates for all projects
  useEffect(() => {
    const coords: Record<string, [number, number]> = {};
    projects.forEach((project) => {
      if (!projectCoords[project.id]) {
        coords[project.id] = getStateCoordinates(project.state);
      }
    });
    if (Object.keys(coords).length > 0) {
      setProjectCoords((prev) => ({ ...prev, ...coords }));
    }
  }, [projects]);

  // Update map center when selected project changes
  useEffect(() => {
    if (selectedProjectId && projectCoords[selectedProjectId]) {
      setMapCenter(projectCoords[selectedProjectId]);
    }
  }, [selectedProjectId, projectCoords]);

  return (
    <div className="relative rounded-xl overflow-hidden border shadow-soft" style={{ height }}>
      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Risk Zones</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-critical/40 border border-risk-critical"></div>
            <span>Critical Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-high/40 border border-risk-high"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-medium/40 border border-risk-medium"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-low/40 border border-risk-low"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Project Type Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Project Types</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🛣️</span>
            <span>Highway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚇</span>
            <span>Metro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚂</span>
            <span>Railway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">✈️</span>
            <span>Airport</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏭</span>
            <span>Industrial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏙️</span>
            <span>Smart City</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {selectedProjectId && projectCoords[selectedProjectId] && (
          <MapRecenter center={projectCoords[selectedProjectId]} />
        )}

        {projects.map((project) => {
          const coords = projectCoords[project.id];
          if (!coords) return null;

          const isSelected = project.id === selectedProjectId;
          const bufferDistance = project.buffer_distance_meters || 5000;
          const riskZoneStyle = getRiskZoneColor(project.project_phase);
          const alignment = project.project_code ? PROJECT_ALIGNMENTS[project.project_code] : null;

          return (
            <div key={project.id}>
              {/* Show LineString alignment if available (Highways/Metro) */}
              {alignment && (
                <>
                  <Polyline
                    positions={alignment}
                    pathOptions={{
                      color: project.project_type === 'highway' ? '#f59e0b' :
                        project.project_type === 'metro' ? '#8b5cf6' :
                          project.project_type === 'railway' ? '#3b82f6' : '#6b7280',
                      weight: isSelected ? 6 : 4,
                      opacity: 0.8,
                      dashArray: project.project_phase === 'proposed' ? '10, 10' : undefined
                    }}
                  />
                  {/* Also show buffer around the line for accurate risk viz? 
                      For now keeping simple circle around center, but ideally buffer should be around line 
                  */}
                </>
              )}

              {/* Risk zone circle - Only show if NO alignment line, or maybe show smaller? 
                  If we have a line, the circle might mimic a specific "center" or "notification area"
              */}
              {!alignment && (
                <Circle
                  center={coords}
                  radius={bufferDistance}
                  pathOptions={riskZoneStyle}
                />
              )}

              {/* Project marker */}
              <Marker
                position={coords}
                icon={createProjectIcon(project.project_type, isSelected)}
                eventHandlers={{
                  click: () => onProjectSelect?.(project),
                }}
              >
                <Popup className="project-popup">
                  <div className="min-w-[200px] p-1">
                    <h3 className="font-semibold text-sm mb-1">{project.project_name}</h3>
                    <Badge className={`${getPhaseColor(project.project_phase)} text-xs mb-2`}>
                      {project.project_phase.replace("_", " ")}
                    </Badge>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.state}
                        {project.districts_covered?.length > 0 && (
                          <span> • {project.districts_covered[0]}</span>
                        )}
                      </p>
                      <p className="capitalize">
                        Type: {project.project_type.replace("_", " ")}
                      </p>
                      {project.budget_crores && (
                        <p>Budget: ₹{project.budget_crores.toLocaleString()} Cr</p>
                      )}
                      <p>Risk Buffer: {(bufferDistance / 1000).toFixed(1)} km</p>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 h-auto mt-2 text-xs"
                      onClick={() => onProjectSelect?.(project)}
                    >
                      View Details <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>

      {/* Empty state overlay */}
      {projects.length === 0 && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[500]">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">No Projects to Display</h3>
            <p className="text-sm text-muted-foreground">
              Add infrastructure projects to see them on the map.
            </p>
          </div>
        </div>
      )}

      {/* Add CSS for marker animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.1); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 12px;
        }
        .custom-project-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

export default ProjectMap;
