
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import json
import os
import time
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

class NHAIScraper:
    def __init__(self):
        self.base_url = "https://nhai.gov.in"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.geolocator = Nominatim(user_agent="laras_scraper_v1")

    def get_coordinates(self, location_name):
        try:
            query = f"{location_name}, India"
            location = self.geolocator.geocode(query, timeout=10)
            if location:
                return location.latitude, location.longitude
        except (GeocoderTimedOut, Exception) as e:
            print(f"Error geocoding {location_name}: {e}")
        return None, None

    def scrape_projects(self):
        print("Scraping NHAI projects...")
        url = f"{self.base_url}/project-information.htm"
        
        try:
            response = self.session.get(url, timeout=30, verify=False)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return []

        soup = BeautifulSoup(response.content, 'html.parser')
        projects = []
        
        table = soup.find('table', {'class': 'project-table'})
        if not table:
             table = soup.find('table')

        if table:
            rows = table.find_all('tr')[1:] 
            print(f"Found {len(rows)} potential project rows.")
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 5: 
                    name = cols[0].text.strip()
                    if len(name) < 5: continue

                    length = cols[2].text.strip().replace(' km', '') if len(cols) > 2 else "0"
                    state = cols[3].text.strip() if len(cols) > 3 else "Unknown"
                    
                    lat, lon = self.get_coordinates(name)
                    if not lat:
                         lat, lon = self.get_coordinates(state)
                    
                    alignment_geojson = None
                    if lat and lon:
                        alignment_geojson = {
                            "type": "Point",
                            "coordinates": [lon, lat]
                        }

                    # Scraped data is limited, so we fill other fields with defaults
                    project = {
                        'project_name': name,
                        'project_code': cols[1].text.strip() if len(cols) > 1 else f"NHAI-{int(datetime.now().timestamp())}",
                        'project_type': 'highway',
                        'state': state,
                        'districts_covered': [state], # Default to state name as district
                        'cities_affected': [],
                        'project_phase': 'ongoing',
                        'budget_crores': float(cols[4].text.strip()) if len(cols) > 4 and cols[4].text.strip().replace('.', '', 1).isdigit() else 0,
                        'total_length_km': float(length) if length.replace('.', '', 1).isdigit() else 0,
                        'notification_date': None,
                        'expected_completion_date': None,
                        'implementing_agency': 'NHAI',
                        'alignment_geojson': alignment_geojson,
                        'data_source': 'NHAI Website'
                    }
                    projects.append(project)
                    time.sleep(1) 
        else:
            print("No table found on NHAI page.")
            
        return projects

    def get_fallback_data(self):
        print("Using comprehensive fallback data (Real-world projects)...")
        return [
            {
                "project_name": "Mumbai Trans Harbour Link (Atal Setu)",
                "project_code": "MTHL-01",
                "project_type": "highway",
                "state": "Maharashtra",
                "districts_covered": ["Mumbai City", "Raigad"],
                "cities_affected": ["Mumbai", "Navi Mumbai"],
                "project_phase": "completed",
                "budget_crores": 17843,
                "total_length_km": 21.8,
                "notification_date": "2017-12-01",
                "expected_completion_date": "2024-01-12",
                "implementing_agency": "MMRDA",
                "alignment_geojson": {"type": "Point", "coordinates": [72.9346, 18.976]}
            },
            {
                "project_name": "Navi Mumbai International Airport",
                "project_code": "NMIA-01",
                "project_type": "airport",
                "state": "Maharashtra",
                "districts_covered": ["Raigad"],
                "cities_affected": ["Navi Mumbai", "Panvel"],
                "project_phase": "construction_started",
                "budget_crores": 16700,
                "total_length_km": 0,
                "notification_date": "2018-01-01",
                "expected_completion_date": "2024-12-31",
                "implementing_agency": "NMIAL / Adani Airports",
                "alignment_geojson": {"type": "Point", "coordinates": [73.0617, 18.9919]}
            },
            {
                "project_name": "Chennai Metro Phase 2",
                "project_code": "CMRL-PH2",
                "project_type": "metro",
                "state": "Tamil Nadu",
                "districts_covered": ["Chennai", "Kancheepuram", "Tiruvallur"],
                "cities_affected": ["Chennai"],
                "project_phase": "ongoing",
                "budget_crores": 61843,
                "total_length_km": 118.9,
                "notification_date": "2021-02-01",
                "expected_completion_date": "2026-12-31",
                "implementing_agency": "CMRL",
                "alignment_geojson": {"type": "Point", "coordinates": [80.2707, 13.0827]}
            },
            {
                "project_name": "Delhi-Mumbai Expressway",
                "project_code": "DME-01",
                "project_type": "highway",
                "state": "Rajasthan",
                "districts_covered": ["Gurugram", "Alwar", "Dausa", "Sawai Madhopur", "Kota", "Ratlam", "Vadodara", "Surat"],
                "cities_affected": ["Gurugram", "Jaipur", "Kota", "Vadodara", "Mumbai"],
                "project_phase": "ongoing",
                "budget_crores": 100000,
                "total_length_km": 1350,
                "notification_date": "2019-03-09",
                "expected_completion_date": "2025-01-01",
                "implementing_agency": "NHAI",
                "alignment_geojson": {"type": "Point", "coordinates": [75.75, 26.9157]}
            },
            {
                "project_name": "Noida International Airport (Jewar)",
                "project_code": "NIA-JEWAR",
                "project_type": "airport",
                "state": "Uttar Pradesh",
                "districts_covered": ["Gautam Buddha Nagar"],
                "cities_affected": ["Jewar", "Greater Noida"],
                "project_phase": "construction_started",
                "budget_crores": 29560,
                "total_length_km": 0,
                "notification_date": "2019-11-29",
                "expected_completion_date": "2024-09-30",
                "implementing_agency": "YZIAPL",
                "alignment_geojson": {"type": "Point", "coordinates": [77.61, 28.17]}
            },
            {
                "project_name": "Mumbai-Ahmedabad High Speed Rail",
                "project_code": "MAHSR-BULLET",
                "project_type": "railway",
                "state": "Gujarat",
                "districts_covered": ["Ahmedabad", "Kheda", "Vadodara", "Bharuch", "Surat", "Navsari", "Valsad", "Palghar", "Thane", "Mumbai"],
                "cities_affected": ["Ahmedabad", "Surat", "Mumbai"],
                "project_phase": "ongoing",
                "budget_crores": 110000,
                "total_length_km": 508,
                "notification_date": "2017-09-14",
                "expected_completion_date": "2027-08-15",
                "implementing_agency": "NHSRCL",
                "alignment_geojson": {"type": "Point", "coordinates": [72.8311, 21.1702]}
            },
            {
                "project_name": "Khavda Renewable Energy Park",
                "project_code": "KHAVDA-RE",
                "project_type": "power_plant",
                "state": "Gujarat",
                "districts_covered": ["Kutch"],
                "cities_affected": ["Khavda"],
                "project_phase": "ongoing",
                "budget_crores": 150000,
                "total_length_km": 0,
                "notification_date": "2020-01-01",
                "expected_completion_date": "2026-01-01",
                "implementing_agency": "Multiple",
                "alignment_geojson": {"type": "Point", "coordinates": [69.35, 24.1167]}
            },
            {
                "project_name": "Chenab Bridge",
                "project_code": "USBRL-CHENAB",
                "project_type": "railway",
                "state": "Jammu and Kashmir",
                "districts_covered": ["Reasi"],
                "cities_affected": ["Kauri", "Bakkal"],
                "project_phase": "completed",
                "budget_crores": 1486,
                "total_length_km": 1.3,
                "notification_date": "2002-01-01",
                "expected_completion_date": "2024-02-20",
                "implementing_agency": "Konkan Railway",
                "alignment_geojson": {"type": "Point", "coordinates": [74.8805, 33.1525]}
            },
            {
                "project_name": "Bangalore Suburban Rail Project",
                "project_code": "BSRP-KA",
                "project_type": "railway",
                "state": "Karnataka",
                "districts_covered": ["Bangalore Urban"],
                "cities_affected": ["Bangalore"],
                "project_phase": "approved",
                "budget_crores": 15767,
                "total_length_km": 148,
                "notification_date": "2020-10-21",
                "expected_completion_date": "2026-10-01",
                "implementing_agency": "K-RIDE",
                "alignment_geojson": {"type": "Point", "coordinates": [77.5946, 12.9716]}
            },
            {
                "project_name": "Greenfield International Airport, Parandur",
                "project_code": "GIA-PARANDUR",
                "project_type": "airport",
                "state": "Tamil Nadu",
                "districts_covered": ["Kancheepuram"],
                "cities_affected": ["Parandur", "Chennai"],
                "project_phase": "land_notification",
                "budget_crores": 20000,
                "total_length_km": 0,
                "notification_date": "2022-08-01",
                "expected_completion_date": "2029-01-01",
                "implementing_agency": "TIDCO",
                "alignment_geojson": {"type": "Point", "coordinates": [79.78, 12.93]}
            }
        ]

    def generate_sql(self, projects):
        if not projects:
            print("No projects to generate SQL for.")
            return

        print(f"Generating SQL for {len(projects)} projects...")
        
        timestamp = datetime.now().isoformat()
        sql_content = f"-- Scraped NHAI Data - {timestamp}\n"
        sql_content += "INSERT INTO public.infrastructure_projects (\n"
        sql_content += "    project_name, project_code, project_type, state, districts_covered, cities_affected, project_phase, budget_crores, total_length_km, notification_date, expected_completion_date, implementing_agency, alignment_geojson, data_source\n"
        sql_content += ") VALUES \n"

        values = []
        for p in projects:
            geojson = "NULL"
            if p.get('alignment_geojson'):
                geojson = f"'{json.dumps(p['alignment_geojson'])}'"
            
            # Helper to escape strings
            def esc(val):
                return f"'{val.replace("'", "''")}'" if val else "NULL"
            
            # Helper for arrays
            def arr(val_list):
                if not val_list: return "NULL"
                quoted = [f"'{x.replace("'", "''")}'" for x in val_list]
                return f"ARRAY[{','.join(quoted)}]"
            
            val = f"({esc(p['project_name'])}, {esc(p['project_code'])}, {esc(p['project_type'])}, {esc(p['state'])}, {arr(p.get('districts_covered'))}, {arr(p.get('cities_affected'))}, {esc(p['project_phase'])}, {p.get('budget_crores', 0)}, {p.get('total_length_km', 0)}, {esc(p.get('notification_date'))}, {esc(p.get('expected_completion_date'))}, {esc(p.get('implementing_agency'))}, {geojson}, 'NHAI Scraper')"
            values.append(val)

        sql_content += ",\n".join(values)
        sql_content += "\nON CONFLICT (project_code) DO UPDATE SET updated_at = now(), budget_crores = EXCLUDED.budget_crores, project_phase = EXCLUDED.project_phase;"

        with open('nhai_scraped_seed.sql', 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print("Saved to nhai_scraped_seed.sql")

if __name__ == "__main__":
    scraper = NHAIScraper()
    projects = scraper.scrape_projects()
    
    if not projects:
        projects = scraper.get_fallback_data()

    if projects:
        # Save to CSV
        try:
            df = pd.DataFrame(projects)
            df.to_csv('nhai_projects.csv', index=False)
            print("Saved to nhai_projects.csv")
        except Exception as e:
            print(f"Error saving CSV: {e}")
        
        # Generate SQL
        scraper.generate_sql(projects)
