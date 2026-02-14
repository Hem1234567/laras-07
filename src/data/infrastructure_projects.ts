export type ProjectType = 'highway' | 'metro' | 'railway' | 'airport' | 'industrial' | 'smart_city' | 'port' | 'power_plant';
export type ProjectPhase = 'proposed' | 'land_notification' | 'approved' | 'under_construction' | 'completed';

export interface InfrastructureProject {
    id: string;
    name: string;
    type: ProjectType;
    phase: ProjectPhase;
    state: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    coordinates: [number, number][]; // LineString (Path) or Point
    buffer: number; // Risk buffer radius in meters
    description?: string;
}

export const INFRASTRUCTURE_PROJECTS: InfrastructureProject[] = [
    {
        id: "MTHL-01",
        name: "Mumbai Trans Harbour Link (MTHL)",
        type: "highway",
        phase: "completed",
        state: "Maharashtra",
        riskLevel: "medium", // Completed projects have lower acquisition risk, but high impact
        buffer: 500,
        description: "India's longest sea bridge connecting Mumbai and Navi Mumbai.",
        coordinates: [
            [18.9986, 72.8569], // Sewri
            [18.9910, 72.8800],
            [18.9800, 72.9200],
            [18.9680, 72.9500],
            [18.9550, 72.9800],
            [18.9480, 73.0030], // Chirle
        ]
    },
    {
        id: "CMRL-PH2",
        name: "Chennai Metro Phase 2 (Corridors 3 & 5)",
        type: "metro",
        phase: "under_construction",
        state: "Tamil Nadu",
        riskLevel: "critical", // Active construction/acquisition
        buffer: 200,
        description: "Expansion of Chennai Metro network connecting Madhavaram to SIPCOT.",
        coordinates: [
            [13.1537, 80.2319], // Madhavaram
            [13.0827, 80.2707], // Central
            [13.0400, 80.2600], // Mylapore
            [12.9904, 80.2173], // Alandur
            [12.9500, 80.2000],
            [12.8340, 80.2223], // Sholinganallur
            [12.7874, 80.2222], // SIPCOT
        ]
    },
    {
        id: "DME-01",
        name: "Delhi-Mumbai Expressway",
        type: "highway",
        phase: "under_construction",
        state: "Maharashtra", // Simplification (passes through many)
        riskLevel: "high",
        buffer: 1000,
        description: "1350 km long expressway connecting New Delhi and Mumbai.",
        coordinates: [
            [28.2800, 77.0700], // Sohna / NCR
            [27.5000, 76.5000],
            [26.9100, 75.7800], // Jaipur
            [25.1800, 75.8300], // Kota
            [23.1800, 75.7700],
            [22.3000, 73.1800], // Vadodara
            [21.1700, 72.8300], // Surat
            [19.2100, 72.9700], // Virar / Mumbai
        ]
    },
    {
        id: "MAHSR-BULLET",
        name: "Mumbai-Ahmedabad Bullet Train",
        type: "railway",
        phase: "under_construction",
        state: "Gujarat",
        riskLevel: "critical",
        buffer: 500,
        description: "High-speed rail corridor connecting Mumbai and Ahmedabad.",
        coordinates: [
            [23.0225, 72.5714], // Ahmedabad
            [22.3072, 73.1812], // Vadodara
            [21.1702, 72.8311], // Surat
            [20.3893, 72.9106], // Vapi
            [19.0760, 72.8777], // Mumbai BKC
        ]
    },
    {
        id: "BSRP-KA",
        name: "Bangalore Suburban Rail",
        type: "railway",
        phase: "land_notification",
        state: "Karnataka",
        riskLevel: "critical",
        buffer: 300,
        description: "Suburban rail network for Bangalore city.",
        coordinates: [
            [13.2000, 77.5000], // Devanahalli (approx)
            [13.0285, 77.5197], // Yeshwanthpur
            [12.9716, 77.5946], // Majestic
            [12.9255, 77.6358], // Koramangala
            [12.8500, 77.6500], // Electronics City
        ]
    },
    {
        id: "G-RING-01",
        name: "Gurgaon Ring Road (Planned)",
        type: "highway",
        phase: "land_notification",
        state: "Haryana",
        riskLevel: "critical",
        buffer: 800,
        coordinates: [
            [28.4595, 77.0266],
            [28.4000, 76.9000],
            [28.3500, 76.9500],
            [28.4200, 77.1000]
        ]
    },
    {
        id: "HYD-PHARMA",
        name: "Hyderabad Pharma City",
        type: "industrial",
        phase: "land_notification",
        state: "Telangana",
        riskLevel: "critical",
        buffer: 2000,
        coordinates: [
            [17.1500, 78.6000],
            [17.1200, 78.6500],
            [17.0800, 78.6200],
            [17.1000, 78.5800],
            [17.1500, 78.6000] // Polygon approximate loop
        ]
    }
];
