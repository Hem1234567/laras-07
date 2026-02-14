import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertTriangle, Shield } from "lucide-react";

// Fix for default marker icons - moved to a function to function safely
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }
};

interface NearbyProject {
  id: string;
  name: string;
  type: string;
  phase: string;
  distance: number;
  riskContribution: number;
  coordinates?: [number, number][]; // Real path
}

interface RiskZoneMapProps {
  latitude: number;
  longitude: number;
  riskLevel: "very_low" | "low" | "medium" | "high" | "critical";
  riskScore: number;
  nearbyProjects: NearbyProject[];
  height?: string;
}

// Custom property marker
const createPropertyMarker = (riskLevel: string) => {
  const colors: Record<string, string> = {
    very_low: "#22c55e",
    low: "#84cc16",
    medium: "#eab308",
    high: "#f97316",
    critical: "#dc2626",
  };

  const color = colors[riskLevel] || "#6b7280";

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: propertyPulse 2s infinite;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `,
    className: "property-marker",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// Project marker for nearby projects (Fallback for Point projects)
const createNearbyProjectMarker = (type: string) => {
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

  return L.divIcon({
    html: `
      <div style="
        background-color: #1e3a5f;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">
          ${icons[type] || "📍"}
        </span>
      </div>
    `,
    className: "project-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

// Map auto-center component
function MapBoundsUpdater({
  center,
  nearbyProjects,
}: {
  center: [number, number];
  nearbyProjects: NearbyProject[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Create bounds including user location
    const bounds = L.latLngBounds([center]);

    // Extend bounds to include projects
    let hasProjects = false;
    nearbyProjects.forEach(p => {
      if (p.coordinates && p.coordinates.length > 0) {
        p.coordinates.forEach(coord => bounds.extend(coord));
        hasProjects = true;
      }
    });

    // If no projects or projects are too far, provide default view
    if (!hasProjects) {
      map.setView(center, 13);
      return;
    }

    try {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } catch (e) {
      console.error("Error setting map bounds:", e);
      map.setView(center, 12);
    }
  }, [center, nearbyProjects, map]);

  return null;
}

export function RiskZoneMap({
  latitude,
  longitude,
  riskLevel,
  riskScore,
  nearbyProjects,
  height = "400px",
}: RiskZoneMapProps) {
  const center: [number, number] = [latitude, longitude];

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const getRiskZoneStyle = (level: string) => {
    const styles: Record<string, { color: string; fillColor: string; fillOpacity: number }> = {
      critical: { color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.2 },
      high: { color: "#f97316", fillColor: "#f97316", fillOpacity: 0.18 },
      medium: { color: "#eab308", fillColor: "#eab308", fillOpacity: 0.15 },
      low: { color: "#84cc16", fillColor: "#84cc16", fillOpacity: 0.12 },
      very_low: { color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.1 },
    };
    return styles[level] || styles.medium;
  };

  return (
    <div className="relative rounded-xl overflow-hidden border shadow-soft" style={{ height }}>
      {/* Risk Level Indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="flex items-center gap-2">
          {riskLevel === "critical" || riskLevel === "high" ? (
            <AlertTriangle className="h-5 w-5 text-risk-critical" />
          ) : (
            <Shield className="h-5 w-5 text-risk-low" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Risk Score</p>
            <p className="font-bold text-lg" style={{
              color: `var(--risk-${riskLevel})`
            }}>
              {riskScore.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Projects Count */}
      <div className="absolute top-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <p className="text-xs text-muted-foreground">Nearby Projects</p>
        <p className="font-bold text-lg text-primary">{nearbyProjects.length}</p>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapBoundsUpdater
          center={center}
          nearbyProjects={nearbyProjects}
        />

        {/* User Risk Zone Circles (Visual only) */}
        {[1, 0.6].map((scale, idx) => (
          <Circle
            key={idx}
            center={center}
            radius={2000 * scale}
            pathOptions={{
              ...getRiskZoneStyle(riskLevel),
              fillOpacity: 0.1,
              weight: 1,
              dashArray: "5, 5",
            }}
          />
        ))}

        {/* Property marker */}
        <Marker position={center} icon={createPropertyMarker(riskLevel)}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">Your Property</h3>
              <p className="text-sm text-muted-foreground capitalize">
                Risk Level: {riskLevel.replace("_", " ")}
              </p>
              <p className="text-sm">Score: {riskScore.toFixed(1)}%</p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby project markers & lines */}
        {nearbyProjects.map((project) => (
          <div key={project.id}>
            {project.coordinates && project.coordinates.length > 1 ? (
              <>
                <Polyline
                  positions={project.coordinates}
                  pathOptions={{
                    color: project.type === 'highway' ? '#f59e0b' : project.type === 'metro' ? '#8b5cf6' : '#3b82f6',
                    weight: 5,
                    opacity: 0.8
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <p className="text-xs capitalize">{project.type} • {project.phase}</p>
                      <p className="text-xs">Dist: {project.distance.toFixed(1)} km</p>
                    </div>
                  </Popup>
                </Polyline>
              </>
            ) : (
              // Render as simple Marker if no coordinates line string
              project.coordinates && project.coordinates.length === 1 && (
                <Marker
                  position={project.coordinates[0]}
                  icon={createNearbyProjectMarker(project.type)}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <p className="text-xs capitalize">{project.type} • {project.phase}</p>
                      <p className="text-xs">Dist: {project.distance.toFixed(1)} km</p>
                    </div>
                  </Popup>
                </Marker>
              )
            )}
          </div>
        ))}
      </MapContainer>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes propertyPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 0 hsl(var(--primary) / 0.4); }
          50% { box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 15px hsl(var(--primary) / 0); }
        }
        .property-marker {
          background: transparent !important;
          border: none !important;
        }
        .project-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

export default RiskZoneMap;
