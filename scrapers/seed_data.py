import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Supabase credentials not found in .env")
    exit(1)

# Real-world project data (Metros, Airports, etc.)
projects = [
    # Metros
    {
        "project_name": "Bangalore Metro Phase 2 (Yellow Line)",
        "project_code": "BMRCL-PH2-Y",
        "project_type": "metro",
        "implementing_agency": "BMRCL",
        "state": "Karnataka",
        "districts_covered": ["Bangalore Urban"],
        "project_phase": "under_construction",
        "alignment_geojson": { "type": "Point", "coordinates": [77.6387, 12.9126] }, # Near Electronic City / HSR
        "total_length_km": 19.0,
        "notification_date": "2019-01-01",
        "data_source": "Seeded Data",
        "is_active": True
    },
    {
        "project_name": "Mumbai Metro Line 3 (Aqua Line)",
        "project_code": "MMRC-L3",
        "project_type": "metro",
        "implementing_agency": "MMRC",
        "state": "Maharashtra",
        "districts_covered": ["Mumbai City", "Mumbai Suburban"],
        "project_phase": "ongoing",
        "alignment_geojson": { "type": "Point", "coordinates": [72.8567, 19.0543] }, # Near Bandra
        "total_length_km": 33.5,
        "data_source": "Seeded Data",
        "is_active": True
    },
    {
        "project_name": "Delhi Metro Phase 4",
        "project_code": "DMRC-PH4",
        "project_type": "metro",
        "implementing_agency": "DMRC",
        "state": "Delhi",
        "districts_covered": ["South Delhi", "New Delhi"],
        "project_phase": "tender_floated",
        "alignment_geojson": { "type": "Point", "coordinates": [77.2188, 28.5244] }, # Near Saket
        "data_source": "Seeded Data",
        "is_active": True
    },
    # Airports
    {
        "project_name": "Navi Mumbai International Airport",
        "project_code": "NMIA",
        "project_type": "airport",
        "implementing_agency": "CIDCO",
        "state": "Maharashtra",
        "districts_covered": ["Raigad"],
        "project_phase": "construction_started",
        "alignment_geojson": { "type": "Point", "coordinates": [73.0726, 18.9902] },
        "total_area_hectares": 1160,
        "data_source": "Seeded Data",
        "is_active": True
    },
    {
        "project_name": "Jewar Airport (Noida International)",
        "project_code": "NIA-JEWAR",
        "project_type": "airport",
        "implementing_agency": "YIAPL",
        "state": "Uttar Pradesh",
        "districts_covered": ["Gautam Buddha Nagar"],
        "project_phase": "construction_started",
        "alignment_geojson": { "type": "Point", "coordinates": [77.5681, 28.2096] }, # Near Jewar
        "data_source": "Seeded Data",
        "is_active": True
    },
    # Other
    {
        "project_name": "Hyderabad Viskakhapatnam Industrial Corridor",
        "project_code": "VCIC",
        "project_type": "industrial",
        "implementing_agency": "NICDIT",
        "state": "Andhra Pradesh",
        "districts_covered": ["Visakhapatnam", "East Godavari"],
        "project_phase": "approved",
        "alignment_geojson": { "type": "Point", "coordinates": [83.2185, 17.6868] },
        "data_source": "Seeded Data",
        "is_active": True
    },
    {
        "project_name": "Chennai Port - Maduravoyal Expressway",
        "project_code": "CHE-MAD-EXP",
        "project_type": "highway",
        "implementing_agency": "NHAI",
        "state": "Tamil Nadu",
        "districts_covered": ["Chennai"],
        "project_phase": "tender_floated",
        "alignment_geojson": { "type": "Point", "coordinates": [80.2707, 13.0827] },
        "data_source": "Seeded Data",
        "is_active": True
    }
]

def seed_data():
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    api_url = f"{url}/rest/v1/infrastructure_projects"
    
    print(f"Seeding {len(projects)} projects via REST API...")
    
    for project in projects:
        try:
            # Query param on_conflict is usually handled by the Prefer header in some setups,
            # or `?on_conflict=project_code` in others. We'll try query param.
            response = requests.post(f"{api_url}?on_conflict=project_code", json=project, headers=headers)
            
            if response.status_code >= 200 and response.status_code < 300:
                print(f"Inserted: {project['project_name']}")
            else:
                 print(f"Error inserting {project['project_name']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Exception inserting {project['project_name']}: {e}")

if __name__ == "__main__":
    seed_data()
