
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vypmrnbmaqxhaniezjii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cG1ybmJtYXF4aGFuaWV6amlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjM1MDAsImV4cCI6MjA4NjUzOTUwMH0.dKkYchFUUtgM0G0aN-RRgeMgk8LL7D1Ng-t3lGZiwng';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const projects = [
    {
        project_name: "Chennai Metro Phase 2",
        project_code: "CMRL-PH2",
        project_type: "metro",
        state: "Tamil Nadu",
        districts_covered: ["Chennai", "Kancheepuram", "Tiruvallur"],
        cities_affected: ["Chennai"],
        project_phase: "ongoing",
        budget_crores: 61843,
        total_length_km: 118.9,
        notification_date: "2021-02-01",
        expected_completion_date: "2026-12-31",
        implementing_agency: "Chennai Metro Rail Limited (CMRL)",
        is_active: true
    },
    {
        project_name: "Mumbai-Ahmedabad High Speed Rail",
        project_code: "MAHSR",
        project_type: "railway",
        state: "Maharashtra",
        districts_covered: ["Mumbai", "Thane", "Palghar"],
        cities_affected: ["Mumbai", "Thane", "Boisar"],
        project_phase: "construction_started",
        budget_crores: 110000,
        total_length_km: 508,
        notification_date: "2017-09-14",
        expected_completion_date: "2027-08-15",
        implementing_agency: "NHSRCL",
        is_active: true
    },
    {
        project_name: "Bangalore Suburban Rail Project",
        project_code: "BSRP",
        project_type: "railway",
        state: "Karnataka",
        districts_covered: ["Bangalore Urban", "Bangalore Rural"],
        cities_affected: ["Bangalore"],
        project_phase: "approved",
        budget_crores: 15767,
        total_length_km: 148,
        notification_date: "2020-10-21",
        expected_completion_date: "2026-10-01",
        implementing_agency: "K-RIDE",
        is_active: true
    },
    {
        project_name: "Greenfield International Airport, Parandur",
        project_code: "GIA-PAR",
        project_type: "airport",
        state: "Tamil Nadu",
        districts_covered: ["Kancheepuram"],
        cities_affected: ["Parandur"],
        project_phase: "land_notification",
        budget_crores: 20000,
        total_length_km: 0,
        notification_date: "2022-08-01",
        expected_completion_date: "2029-01-01",
        implementing_agency: "TIDCO",
        is_active: true
    }
];

async function seed() {
    console.log('Seeding projects...');
    const { data, error } = await supabase
        .from('infrastructure_projects')
        .insert(projects)
        .select();

    if (error) {
        console.error('Error seeding projects:', error);
    } else {
        console.log(`Successfully seeded ${data.length} projects!`);
    }
}

seed();
