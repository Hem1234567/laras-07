import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import json
import os
import time
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from dotenv import load_dotenv
import json

# Try importing supabase, else mock it
try:
    from supabase import create_client, Client
    SUPABASE_LIB_AVAILABLE = True
except ImportError:
    SUPABASE_LIB_AVAILABLE = False
    print("Supabase library not found. Will use REST API fallback.")

# Load environment variables
load_dotenv()

class NHAIScraper:
    def __init__(self):
        self.base_url = "https://nhai.gov.in"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.geolocator = Nominatim(user_agent="laras_scraper_v1")
        
        # Initialize Supabase client
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")
        
        self.supabase = None
        if url and key and SUPABASE_LIB_AVAILABLE:
             try:
                self.supabase: Client = create_client(url, key)
             except NameError:
                pass
        elif not url or not key:
            print("Warning: Supabase credentials not found. Data will only be saved to CSV.")

    def get_coordinates(self, location_name):
        try:
            # Append 'India' to ensure we get results within the country
            query = f"{location_name}, India"
            location = self.geolocator.geocode(query, timeout=10)
            if location:
                return location.latitude, location.longitude
        except (GeocoderTimedOut, Exception) as e:
            print(f"Error geocoding {location_name}: {e}")
        return None, None

    def get_fallback_data(self):
        print("Using fallback real-world data.")
        projects = []
        fallback_projects = [
            {"name": "Delhi-Mumbai Expressway", "state": "Rajasthan", "length": "1350", "cost": "100000"},
            {"name": "Bangalore-Chennai Expressway", "state": "Karnataka", "length": "262", "cost": "17000"},
            {"name": "Dwarka Expressway", "state": "Delhi", "length": "29", "cost": "9000"},
            {"name": "Mumbai-Nagpur Expressway", "state": "Maharashtra", "length": "701", "cost": "55000"},
            {"name": "Ganga Expressway", "state": "Uttar Pradesh", "length": "594", "cost": "36000"},
        ]
        
        for fp in fallback_projects:
            lat, lon = self.get_coordinates(fp["name"])
            if not lat:
                 lat, lon = self.get_coordinates(fp["state"]) # Fallback to state center
            
            alignment_geojson = {
                "type": "Point",
                "coordinates": [lon, lat]
            } if lat and lon else None

            projects.append({
                'project_name': fp["name"],
                'project_code': f"NHAI-FB-{fp['name'].replace(' ', '-')}",
                'total_length_km': float(fp["length"]),
                'state': fp["state"],
                'budget_crores': float(fp["cost"]),
                'project_type': 'highway',
                'project_phase': 'construction_started',
                'alignment_geojson': alignment_geojson,
                'data_source': 'Real World Data (Fallback)',
                'last_updated_from_source': datetime.now().isoformat()
            })
        return projects

    def scrape_projects(self):
        print("Scraping NHAI projects...")
        url = f"{self.base_url}/project-information.htm"
        
        soup = None
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")
            # Do not return empty, proceed to check soup/fallback

        projects = []
        table = None
        if soup:
            table = soup.find('table', {'class': 'project-table'})
            if not table:
                 table = soup.find('table')

        if table:
            rows = table.find_all('tr')[1:]  # Skip header
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 5: 
                    name = cols[0].text.strip()
                    length = cols[2].text.strip().replace(' km', '') if len(cols) > 2 else "0"
                    
                    lat, lon = self.get_coordinates(name)
                    
                    alignment_geojson = None
                    if lat and lon:
                        alignment_geojson = {
                            "type": "Point",
                            "coordinates": [lon, lat]
                        }

                    project = {
                        'project_name': name,
                        'project_code': cols[1].text.strip() if len(cols) > 1 else f"NHAI-{datetime.now().timestamp()}",
                        'total_length_km': float(length) if length.replace('.', '', 1).isdigit() else 0,
                        'state': cols[3].text.strip() if len(cols) > 3 else "Unknown",
                        'budget_crores': float(cols[4].text.strip()) if len(cols) > 4 and cols[4].text.strip().replace('.', '', 1).isdigit() else 0,
                        'project_type': 'highway',
                        'project_phase': 'ongoing',
                        'alignment_geojson': alignment_geojson,
                        'data_source': 'NHAI Website',
                        'last_updated_from_source': datetime.now().isoformat()
                    }
                    projects.append(project)
                    time.sleep(1)
        else:
            projects = self.get_fallback_data()

        return projects
        
        # Fallback if specific class not found, try finding any table
        if not table:
             table = soup.find('table')

        if not table:
             table = soup.find('table')

        if table:
            rows = table.find_all('tr')[1:]  # Skip header
            for row in rows:
                cols = row.find_all('td')
                # Ensure we have enough columns before accessing
                if len(cols) >= 5: 
                    # Extracting text and cleaning
                    name = cols[0].text.strip()
                    length = cols[2].text.strip().replace(' km', '') if len(cols) > 2 else "0"
                    
                    # Geocode the location (using project name or state as proxy)
                    # For better accuracy, we'd extract specific city/location names
                    # Here we try to use the name of the project if it contains location info
                    lat, lon = self.get_coordinates(name)
                    
                    alignment_geojson = None
                    if lat and lon:
                        alignment_geojson = {
                            "type": "Point",
                            "coordinates": [lon, lat]
                        }

                    project = {
                        'project_name': name,
                        'project_code': cols[1].text.strip() if len(cols) > 1 else f"NHAI-{datetime.now().timestamp()}",
                        'total_length_km': float(length) if length.replace('.', '', 1).isdigit() else 0,
                        'state': cols[3].text.strip() if len(cols) > 3 else "Unknown",
                        'budget_crores': float(cols[4].text.strip()) if len(cols) > 4 and cols[4].text.strip().replace('.', '', 1).isdigit() else 0,
                        'project_type': 'highway', # Default for NHAI
                        'project_phase': 'ongoing', # Simplify status mapping
                        'alignment_geojson': alignment_geojson,
                        'data_source': 'NHAI Website',
                        'last_updated_from_source': datetime.now().isoformat()
                    }
                    projects.append(project)
                    # Be nice to the geocoding service
                    time.sleep(1)
        else:
            print("No project table found on the page. Using fallback real-world data.")
            # Fallback to real-world major projects if scraping fails
            fallback_projects = [
                {"name": "Delhi-Mumbai Expressway", "state": "Rajasthan", "length": "1350", "cost": "100000"},
                {"name": "Bangalore-Chennai Expressway", "state": "Karnataka", "length": "262", "cost": "17000"},
                {"name": "Dwarka Expressway", "state": "Delhi", "length": "29", "cost": "9000"},
                {"name": "Mumbai-Nagpur Expressway", "state": "Maharashtra", "length": "701", "cost": "55000"},
                {"name": "Ganga Expressway", "state": "Uttar Pradesh", "length": "594", "cost": "36000"},
            ]
            
            for fp in fallback_projects:
                lat, lon = self.get_coordinates(fp["name"])
                if not lat:
                     lat, lon = self.get_coordinates(fp["state"]) # Fallback to state center
                
                alignment_geojson = {
                    "type": "Point",
                    "coordinates": [lon, lat]
                } if lat and lon else None

                projects.append({
                    'project_name': fp["name"],
                    'project_code': f"NHAI-FALLBACK-{fp['name'].replace(' ', '-')}",
                    'total_length_km': float(fp["length"]),
                    'state': fp["state"],
                    'budget_crores': float(fp["cost"]),
                    'project_type': 'highway',
                    'project_phase': 'construction_started',
                    'alignment_geojson': alignment_geojson,
                    'data_source': 'Real World Data (Fallback)',
                    'last_updated_from_source': datetime.now().isoformat()
                })

        return projects
    
    def save_to_supabase(self, projects):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

        if not url or not key:
            print("Supabase credentials missing.")
            return

        print(f"Upserting {len(projects)} projects to Supabase...")
        
        if SUPABASE_LIB_AVAILABLE:
            if not self.supabase:
                 self.supabase = create_client(url, key)
            for project in projects:
                try:
                    data, count = self.supabase.table('infrastructure_projects').upsert(project, on_conflict='project_code').execute()
                except Exception as e:
                    print(f"Error upserting project {project['project_name']}: {e}")
        else:
            # REST API Fallback
            headers = {
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            }
            api_url = f"{url}/rest/v1/infrastructure_projects"
            
            # Post in batches or individually
            for project in projects:
                try:
                    # 'on_conflict' param in URL is available in PostgREST 9.0+?
                    # Standard upsert via POST with "Prefer: resolution=merge-duplicates" usually works on PKs.
                    # We need to ensure 'project_code' is unique constraint.
                    response = requests.post(f"{api_url}?on_conflict=project_code", json=project, headers=headers)
                    if response.status_code >= 400:
                         print(f"REST Error {response.status_code}: {response.text}")
                except Exception as e:
                    print(f"Error posting project {project['project_name']}: {e}")

if __name__ == "__main__":
    scraper = NHAIScraper()
    projects = scraper.scrape_projects()
    
    if projects:
        # 1. Save to CSV as before
        output_dir = "data"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        df = pd.DataFrame(projects)
        output_file = os.path.join(output_dir, 'nhai_projects.csv')
        df.to_csv(output_file, index=False)
        print(f"Scraped {len(projects)} projects. Saved to {output_file}")
        
        # 2. Save to Supabase
        scraper.save_to_supabase(projects)
    else:
        print("No projects found to save.")
