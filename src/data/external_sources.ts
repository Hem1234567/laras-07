export type SourceCategory =
    | "National Infrastructure"
    | "Railway Projects"
    | "Metro Rail"
    | "Gazette & Legal"
    | "State Portals"
    | "News & Media"
    | "Tenders"
    | "Geographic & Mapping"
    | "Real Estate"
    | "Community"
    | "Academic"
    | "Financial"
    | "Technical"
    | "Special Economic Zones"
    | "Emerging";

export interface DataSource {
    name: string;
    url: string;
    description: string;
    category: SourceCategory;
}

export const DATA_SOURCES: DataSource[] = [
    // 1. National Infrastructure
    { name: "NHAI", url: "https://nhai.gov.in", description: "Projects, tenders, alignments, notifications", category: "National Infrastructure" },
    { name: "MoRTH", url: "https://morth.nic.in", description: "Project pipeline, annual reports, policies", category: "National Infrastructure" },
    { name: "PM Gati Shakti", url: "https://pmgatishakti.gov.in", description: "National master plan, integrated projects", category: "National Infrastructure" },
    { name: "National Infrastructure Pipeline", url: "https://infrastructure.gov.in", description: "₹111 lakh crore projects database", category: "National Infrastructure" },

    // 2. Railway Projects
    { name: "Indian Railways", url: "https://indianrailways.gov.in", description: "New lines, doubling, electrification", category: "Railway Projects" },
    { name: "Dedicated Freight Corridor", url: "https://dfccil.com", description: "Western & Eastern DFC alignments", category: "Railway Projects" },
    { name: "Railway Board", url: "https://rb.ntes.co.in", description: "Tenders, circulars, notifications", category: "Railway Projects" },

    // 3. Metro Rail Projects
    { name: "Delhi Metro (DMRC)", url: "https://www.delhimetrorail.com", description: "Phase 4 expansions", category: "Metro Rail" },
    { name: "Chennai Metro (CMRL)", url: "https://chennaimetrorail.org", description: "Phase 2 alignments", category: "Metro Rail" },
    { name: "Bangalore Metro (BMRCL)", url: "https://english.bmrc.co.in", description: "Phase 2A, 2B routes", category: "Metro Rail" },
    { name: "Mumbai Metro (MMRCL)", url: "https://www.mmrcl.com", description: "All 14 lines", category: "Metro Rail" },
    { name: "Kolkata Metro", url: "https://mtp.indianrailways.gov.in", description: "East-West corridor", category: "Metro Rail" },

    // 4. Official Gazette & Notifications + Legal
    { name: "e-Gazette of India", url: "https://egazette.gov.in", description: "Section 3A, 3D notifications", category: "Gazette & Legal" },
    { name: "Land Acquisition (DoLR)", url: "https://dolr.gov.in", description: "LARR Act circulars", category: "Gazette & Legal" },
    { name: "Supreme Court", url: "https://main.sci.gov.in", description: "Judgments on compensation", category: "Gazette & Legal" },
    { name: "Indian Kanoon", url: "https://indiankanoon.org", description: "Legal search engine", category: "Gazette & Legal" },
    { name: "e-Courts Services", url: "https://judgments.ecourts.gov.in", description: "State-wise judgments", category: "Gazette & Legal" },
    { name: "India Code", url: "https://www.indiacode.nic.in", description: "Official legislation", category: "Gazette & Legal" },

    // 5-8. State Portals
    { name: "MahaPWD", url: "https://mspwd.org", description: "Maharashtra road projects", category: "State Portals" },
    { name: "MSRDC", url: "https://www.msrdc.org", description: "Maharashtra expressways", category: "State Portals" },
    { name: "Mumbai Metro One", url: "https://www.mumbaimetroone.com", description: "Line 2A, 2B, 7", category: "State Portals" },
    { name: "MahaRERA", url: "https://maharera.mahaonline.gov.in", description: "Project registrations", category: "State Portals" },
    { name: "Karnataka PWD", url: "https://kpwd.gov.in", description: "State highway projects", category: "State Portals" },
    { name: "BDA Bangalore", url: "https://www.bdabangalore.org", description: "Layout plans", category: "State Portals" },
    { name: "KIADB", url: "https://kiadb.in", description: "Industrial land acquisition", category: "State Portals" },
    { name: "TN Highways", url: "https://tnhighways.org", description: "Tamil Nadu road projects", category: "State Portals" },
    { name: "CMDA Chennai", url: "https://www.cmdachennai.gov.in", description: "Master plans", category: "State Portals" },
    { name: "SIPCOT", url: "https://www.sipcot.com", description: "Industrial parks", category: "State Portals" },
    { name: "DDA Delhi", url: "https://dda.gov.in", description: "Land pooling, acquisition", category: "State Portals" },
    { name: "NCR Planning Board", url: "https://ncrpb.nic.in", description: "Regional plans", category: "State Portals" },
    { name: "Gurugram Metro", url: "https://gmrc.co.in", description: "Rapid metro", category: "State Portals" },

    // 9. News
    { name: "Times of India Infra", url: "https://timesofindia.indiatimes.com/business/infrastructure", description: "Infrastructure news", category: "News & Media" },
    { name: "The Hindu Infra", url: "https://www.thehindu.com/business/industry/infrastructure", description: "Project updates", category: "News & Media" },
    { name: "Economic Times Construction", url: "https://economictimes.indiatimes.com/industry/indl-goods/svs/construction", description: "Sector news", category: "News & Media" },
    { name: "Business Standard", url: "https://www.business-standard.com/infrastructure", description: "Project financing", category: "News & Media" },
    { name: "PIB", url: "https://pib.gov.in", description: "Official press releases", category: "News & Media" },

    // 10. Tenders
    { name: "CPPP", url: "https://eprocure.gov.in", description: "Central tenders", category: "Tenders" },
    { name: "GeM", url: "https://gem.gov.in", description: "Government e-Marketplace", category: "Tenders" },
    { name: "Maharashtra Tenders", url: "https://maharashtra.gov.in/tenders", description: "State tenders", category: "Tenders" },

    // 11. Geographic
    { name: "Bhuvan ISRO", url: "https://bhuvan.nrsc.gov.in", description: "Satellite imagery", category: "Geographic & Mapping" },
    { name: "OpenStreetMap", url: "https://openstreetmap.org", description: "Road networks", category: "Geographic & Mapping" },
    { name: "Survey of India", url: "https://surveyofindia.gov.in", description: "Topographic maps", category: "Geographic & Mapping" },
    { name: "Bhoomi (Karnataka)", url: "https://landrecords.karnataka.gov.in", description: "Online RTC", category: "Geographic & Mapping" },
    { name: "Mahabhumi", url: "https://mahabhumi.gov.in", description: "7/12 extracts", category: "Geographic & Mapping" },
    { name: "UP Bhulekh", url: "https://upbhulekh.gov.in", description: "Khatauni records", category: "Geographic & Mapping" },

    // 12. Real Estate
    { name: "MagicBricks", url: "https://magicbricks.com", description: "Property rates", category: "Real Estate" },
    { name: "99acres", url: "https://99acres.com", description: "Pricing trends", category: "Real Estate" },
    { name: "Housing.com", url: "https://housing.com", description: "Market trends", category: "Real Estate" },

    // 13. Financial & Others
    { name: "BSE India", url: "https://bseindia.com", description: "Infra company filings", category: "Financial" },
    { name: "NSE India", url: "https://nseindia.com", description: "Project announcements", category: "Financial" },
    { name: "SEZ India", url: "https://sezindia.nic.in", description: "SEZ notifications", category: "Special Economic Zones" },
    { name: "Environment Clearance", url: "https://environmentclearance.nic.in", description: "EIA reports", category: "Technical" },
    { name: "Google Scholar", url: "https://scholar.google.com", description: "Research papers", category: "Academic" },
];
