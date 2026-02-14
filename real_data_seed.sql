-- Seed data for infrastructure_projects generated from real-world data
-- Timestamp: 2026-02-13T13:39:52.022Z

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
(
    'Mumbai Trans Harbour Link (Atal Setu)',
    'MTHL-01',
    'highway',
    'Maharashtra',
    ARRAY['Mumbai City','Raigad'],
    ARRAY['Mumbai','Navi Mumbai'],
    'completed',
    17843,
    21.8,
    '2017-12-01',
    '2024-01-12',
    'MMRDA',
    true,
    '{
      "type": "Point",
      "coordinates": [72.9346, 18.976]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Navi Mumbai International Airport',
    'NMIA-01',
    'airport',
    'Maharashtra',
    ARRAY['Raigad'],
    ARRAY['Navi Mumbai','Panvel'],
    'construction_started',
    16700,
    0,
    '2018-01-01',
    '2024-12-31',
    'NMIAL / Adani Airports',
    true,
    '{
      "type": "Point",
      "coordinates": [73.0617, 18.9919]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Chennai Metro Phase 2',
    'CMRL-PH2',
    'metro',
    'Tamil Nadu',
    ARRAY['Chennai','Kancheepuram','Tiruvallur'],
    ARRAY['Chennai'],
    'ongoing',
    61843,
    118.9,
    '2021-02-01',
    '2026-12-31',
    'CMRL',
    true,
    '{
      "type": "Point",
      "coordinates": [80.2707, 13.0827]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Delhi-Mumbai Expressway',
    'DME-01',
    'highway',
    'Rajasthan',
    ARRAY['Gurugram','Alwar','Dausa','Sawai Madhopur','Kota','Ratlam','Vadodara','Surat'],
    ARRAY['Gurugram','Jaipur','Kota','Vadodara','Mumbai'],
    'ongoing',
    100000,
    1350,
    '2019-03-09',
    '2025-01-01',
    'NHAI',
    true,
    '{
      "type": "Point",
      "coordinates": [75.75, 26.9157]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Noida International Airport (Jewar)',
    'NIA-JEWAR',
    'airport',
    'Uttar Pradesh',
    ARRAY['Gautam Buddha Nagar'],
    ARRAY['Jewar','Greater Noida'],
    'construction_started',
    29560,
    0,
    '2019-11-29',
    '2024-09-30',
    'YZIAPL',
    true,
    '{
      "type": "Point",
      "coordinates": [77.61, 28.17]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Mumbai-Ahmedabad High Speed Rail',
    'MAHSR-BULLET',
    'railway',
    'Gujarat',
    ARRAY['Ahmedabad','Kheda','Vadodara','Bharuch','Surat','Navsari','Valsad','Palghar','Thane','Mumbai'],
    ARRAY['Ahmedabad','Surat','Mumbai'],
    'ongoing',
    110000,
    508,
    '2017-09-14',
    '2027-08-15',
    'NHSRCL',
    true,
    '{
      "type": "Point",
      "coordinates": [72.8311, 21.1702]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Khavda Renewable Energy Park',
    'KHAVDA-RE',
    'power_plant',
    'Gujarat',
    ARRAY['Kutch'],
    ARRAY['Khavda'],
    'ongoing',
    150000,
    0,
    '2020-01-01',
    '2026-01-01',
    'Multiple (Adani, NTPC, etc.)',
    true,
    '{
      "type": "Point",
      "coordinates": [69.35, 24.1167]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Chenab Bridge (Udhampur-Srinagar-Baramulla)',
    'USBRL-CHENAB',
    'railway',
    'Jammu and Kashmir',
    ARRAY['Reasi'],
    ARRAY['Kauri','Bakkal'],
    'completed',
    1486,
    1.3,
    '2002-01-01',
    '2024-02-20',
    'Konkan Railway / Northern Railway',
    true,
    '{
      "type": "Point",
      "coordinates": [74.8805, 33.1525]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Bangalore Suburban Rail Project',
    'BSRP-KA',
    'railway',
    'Karnataka',
    ARRAY['Bangalore Urban'],
    ARRAY['Bangalore'],
    'approved',
    15767,
    148,
    '2020-10-21',
    '2026-10-01',
    'K-RIDE',
    true,
    '{
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Greenfield International Airport, Parandur',
    'GIA-PARANDUR',
    'airport',
    'Tamil Nadu',
    ARRAY['Kancheepuram'],
    ARRAY['Parandur','Chennai'],
    'land_notification',
    20000,
    0,
    '2022-08-01',
    '2029-01-01',
    'TIDCO',
    true,
    '{
      "type": "Point",
      "coordinates": [79.78, 12.93]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'SilverLine Project (K-Rail)',
    'K-RAIL-SL',
    'railway',
    'Kerala',
    ARRAY['Thiruvananthapuram','Kollam','Kottayam','Ernakulam','Thrissur','Kozhikode','Kannur','Kasargod'],
    ARRAY['Thiruvananthapuram','Kochi','Kozhikode'],
    'proposed',
    63941,
    529.45,
    '2020-01-01',
    '2030-01-01',
    'K-Rail',
    true,
    '{
      "type": "Point",
      "coordinates": [76.2673, 9.9312]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Mumbai Coastal Road Project (Phase 1)',
    'MCRP-PH1',
    'highway',
    'Maharashtra',
    ARRAY['Mumbai City'],
    ARRAY['Mumbai'],
    'completed',
    12721,
    10.58,
    '2018-10-01',
    '2024-03-11',
    'BMC',
    true,
    '{
      "type": "Point",
      "coordinates": [72.818, 19.0176]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Dholera Special Investment Region (SIR)',
    'DSIR-01',
    'smart_city',
    'Gujarat',
    ARRAY['Ahmedabad'],
    ARRAY['Dholera'],
    'ongoing',
    30000,
    0,
    '2009-01-01',
    '2030-12-31',
    'DSIRDA',
    true,
    '{
      "type": "Point",
      "coordinates": [72.19, 22.25]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
),
(
    'Polavaram Irrigation Project',
    'POLAVARAM-01',
    'power_plant',
    'Andhra Pradesh',
    ARRAY['Eluru','East Godavari'],
    ARRAY['Polavaram'],
    'ongoing',
    55548,
    0,
    '2005-01-01',
    '2025-12-31',
    'Water Resources Dept, AP',
    true,
    '{
      "type": "Point",
      "coordinates": [81.65, 17.2667]
    }',
    5000, -- Default buffer 5km
    'Government sources & Web Scraping'
)
ON CONFLICT (project_code) 
DO UPDATE SET
    project_name = EXCLUDED.project_name,
    budget_crores = EXCLUDED.budget_crores,
    project_phase = EXCLUDED.project_phase,
    updated_at = now();
