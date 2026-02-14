
import fs from 'fs';

const projects = [
    {
        name: "Mumbai Trans Harbour Link (Atal Setu)",
        code: "MTHL-01",
        type: "highway", // Mapped to 'highway' as it's a bridge/road
        state: "Maharashtra",
        districts: ["Mumbai City", "Raigad"],
        cities: ["Mumbai", "Navi Mumbai"],
        phase: "completed",
        budget: 17843,
        length: 21.8,
        coords: [18.9760, 72.9346], // Sewri end
        agency: "MMRDA",
        notification: "2017-12-01",
        completion: "2024-01-12",
        desc: "India's longest sea bridge connecting Mumbai and Navi Mumbai."
    },
    {
        name: "Navi Mumbai International Airport",
        code: "NMIA-01",
        type: "airport",
        state: "Maharashtra",
        districts: ["Raigad"],
        cities: ["Navi Mumbai", "Panvel"],
        phase: "under_construction", // Mapped from 'construction_started'
        budget: 16700,
        length: 0,
        coords: [18.9919, 73.0617],
        agency: "NMIAL / Adani Airports",
        notification: "2018-01-01",
        completion: "2024-12-31",
        desc: "Greenfield international airport being built in Ulwe/Kopar-Panvel."
    },
    {
        name: "Chennai Metro Phase 2",
        code: "CMRL-PH2",
        type: "metro",
        state: "Tamil Nadu",
        districts: ["Chennai", "Kancheepuram", "Tiruvallur"],
        cities: ["Chennai"],
        phase: "ongoing",
        budget: 61843,
        length: 118.9,
        coords: [13.0827, 80.2707], // Central Chennai
        agency: "CMRL",
        notification: "2021-02-01",
        completion: "2026-12-31",
        desc: "Major expansion of Chennai's metro network adding 3 new lines."
    },
    {
        name: "Delhi-Mumbai Expressway",
        code: "DME-01",
        type: "highway",
        state: "Rajasthan", // Major section
        districts: ["Gurugram", "Alwar", "Dausa", "Sawai Madhopur", "Kota", "Ratlam", "Vadodara", "Surat"],
        cities: ["Gurugram", "Jaipur", "Kota", "Vadodara", "Mumbai"],
        phase: "ongoing", // Partially completed
        budget: 100000,
        length: 1350,
        coords: [26.9157, 75.7500], // Approx center (Jaipur area)
        agency: "NHAI",
        notification: "2019-03-09",
        completion: "2025-01-01",
        desc: "8-lane access-controlled expressway connecting New Delhi with Mumbai."
    },
    {
        name: "Noida International Airport (Jewar)",
        code: "NIA-JEWAR",
        type: "airport",
        state: "Uttar Pradesh",
        districts: ["Gautam Buddha Nagar"],
        cities: ["Jewar", "Greater Noida"],
        phase: "under_construction",
        budget: 29560,
        length: 0,
        coords: [28.1700, 77.6100],
        agency: "YZIAPL",
        notification: "2019-11-29",
        completion: "2024-09-30",
        desc: "Upcoming international airport to serve the National Capital Region."
    },
    {
        name: "Mumbai-Ahmedabad High Speed Rail",
        code: "MAHSR-BULLET",
        type: "railway",
        state: "Gujarat",
        districts: ["Ahmedabad", "Kheda", "Vadodara", "Bharuch", "Surat", "Navsari", "Valsad", "Palghar", "Thane", "Mumbai"],
        cities: ["Ahmedabad", "Surat", "Mumbai"],
        phase: "ongoing",
        budget: 110000,
        length: 508,
        coords: [21.1702, 72.8311], // Surround Surat (midpoint-ish)
        agency: "NHSRCL",
        notification: "2017-09-14",
        completion: "2027-08-15",
        desc: "India's first high-speed rail corridor (Bullet Train)."
    },
    {
        name: "Khavda Renewable Energy Park",
        code: "KHAVDA-RE",
        type: "power_plant",
        state: "Gujarat",
        districts: ["Kutch"],
        cities: ["Khavda"],
        phase: "ongoing",
        budget: 150000, // Estimated total investment
        length: 0,
        coords: [24.1167, 69.3500],
        agency: "Multiple (Adani, NTPC, etc.)",
        notification: "2020-01-01",
        completion: "2026-01-01",
        desc: "World's largest hybrid renewable energy park (Solar + Wind)."
    },
    {
        name: "Chenab Bridge (Udhampur-Srinagar-Baramulla)",
        code: "USBRL-CHENAB",
        type: "railway",
        state: "Jammu and Kashmir", // Mapped to J&K
        districts: ["Reasi"],
        cities: ["Kauri", "Bakkal"],
        phase: "completed", // Bridge completed
        budget: 1486, // Cost of bridge only
        length: 1.3,
        coords: [33.1525, 74.8805],
        agency: "Konkan Railway / Northern Railway",
        notification: "2002-01-01",
        completion: "2024-02-20",
        desc: "World's highest railway bridge over the Chenab river."
    },
    {
        name: "Bangalore Suburban Rail Project",
        code: "BSRP-KA",
        type: "railway",
        state: "Karnataka",
        districts: ["Bangalore Urban"],
        cities: ["Bangalore"],
        phase: "approved",
        budget: 15767,
        length: 148,
        coords: [12.9716, 77.5946],
        agency: "K-RIDE",
        notification: "2020-10-21",
        completion: "2026-10-01",
        desc: "Suburban rail network to decongest Bangalore city traffic."
    },
    {
        name: "Greenfield International Airport, Parandur",
        code: "GIA-PARANDUR",
        type: "airport",
        state: "Tamil Nadu",
        districts: ["Kancheepuram"],
        cities: ["Parandur", "Chennai"],
        phase: "land_notification",
        budget: 20000,
        length: 0,
        coords: [12.9300, 79.7800], // Approx Parandur location
        agency: "TIDCO",
        notification: "2022-08-01",
        completion: "2029-01-01",
        desc: "Proposed second airport for Chennai."
    },
    {
        name: "SilverLine Project (K-Rail)",
        code: "K-RAIL-SL",
        type: "railway",
        state: "Kerala",
        districts: ["Thiruvananthapuram", "Kollam", "Kottayam", "Ernakulam", "Thrissur", "Kozhikode", "Kannur", "Kasargod"],
        cities: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
        phase: "proposed", // Stalled/Proposed
        budget: 63941,
        length: 529.45,
        coords: [9.9312, 76.2673], // Kochi
        agency: "K-Rail",
        notification: "2020-01-01",
        completion: "2030-01-01",
        desc: "Semi-high speed rail corridor connecting north and south Kerala."
    },
    {
        name: "Mumbai Coastal Road Project (Phase 1)",
        code: "MCRP-PH1",
        type: "highway",
        state: "Maharashtra",
        districts: ["Mumbai City"],
        cities: ["Mumbai"],
        phase: "completed", // Phase 1 mostly done
        budget: 12721,
        length: 10.58,
        coords: [19.0176, 72.8180], // Worli Sea Face area
        agency: "BMC",
        notification: "2018-10-01",
        completion: "2024-03-11", // Partial inauguration
        desc: "8-lane coastal road connecting South Mumbai with North Mumbai."
    },
    {
        name: "Dholera Special Investment Region (SIR)",
        code: "DSIR-01",
        type: "smart_city", // Mapped to smart_city or industrial
        state: "Gujarat",
        districts: ["Ahmedabad"],
        cities: ["Dholera"],
        phase: "ongoing",
        budget: 30000,
        length: 0,
        coords: [22.2500, 72.1900],
        agency: "DSIRDA",
        notification: "2009-01-01",
        completion: "2030-12-31",
        desc: "India's first platinum-rated industrial smart city."
    },
    {
        name: "Polavaram Irrigation Project",
        code: "POLAVARAM-01",
        type: "power_plant", // Mapped to power/industrial as irrigation not in enums? Or 'industrial'
        state: "Andhra Pradesh",
        districts: ["Eluru", "East Godavari"],
        cities: ["Polavaram"],
        phase: "ongoing",
        budget: 55548,
        length: 0,
        coords: [17.2667, 81.6500],
        agency: "Water Resources Dept, AP",
        notification: "2005-01-01",
        completion: "2025-12-31",
        desc: "Multi-purpose irrigation project on the Godavari River."
    }
];

// Helper to escape single quotes for SQL
const safeStr = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
const safeNum = (num) => num !== undefined ? num : 'NULL';
const safeArr = (arr) => arr ? `ARRAY[${arr.map(s => `'${s}'`).join(',')}]` : 'NULL';

function generateSQL() {
    let sql = `-- Seed data for infrastructure_projects generated from real-world data
-- Timestamp: ${new Date().toISOString()}

INSERT INTO public.infrastructure_projects (
    project_name, 
    project_code, 
    project_type, 
    state, 
    districts_covered, 
    cities_affected, 
    project_phase, 
    budget_crores, 
    total_length_km, 
    notification_date, 
    expected_completion_date, 
    implementing_agency, 
    is_active,
    alignment_geojson,
    buffer_distance_meters,
    data_source
) VALUES 
`;

    const values = projects.map(p => {
        // Construct real GeoJSON Point from coords
        const geojson = `'{
      "type": "Point",
      "coordinates": [${p.coords[1]}, ${p.coords[0]}]
    }'`;

        // Map phases to enum values if needed
        let phase = p.phase;
        if (phase === 'under_construction') phase = 'construction_started';

        return `(
    ${safeStr(p.name)},
    ${safeStr(p.code)},
    ${safeStr(p.type)},
    ${safeStr(p.state)},
    ${safeArr(p.districts)},
    ${safeArr(p.cities)},
    ${safeStr(phase)},
    ${safeNum(p.budget)},
    ${safeNum(p.length)},
    ${safeStr(p.notification)},
    ${safeStr(p.completion)},
    ${safeStr(p.agency)},
    true,
    ${geojson},
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
)`;
    });

    sql += values.join(',\n') + `
ON CONFLICT (project_code) 
DO UPDATE SET
    project_name = EXCLUDED.project_name,
    budget_crores = EXCLUDED.budget_crores,
    project_phase = EXCLUDED.project_phase,
    updated_at = now();
`;

    return sql;
}

const sqlContent = generateSQL();
fs.writeFileSync('real_data_seed.sql', sqlContent);
console.log('Generated real_data_seed.sql with ' + projects.length + ' projects.');
