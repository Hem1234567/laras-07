
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vypmrnbmaqxhaniezjii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cG1ybmJtYXF4aGFuaWV6amlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjM1MDAsImV4cCI6MjA4NjUzOTUwMH0.dKkYchFUUtgM0G0aN-RRgeMgk8LL7D1Ng-t3lGZiwng';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkCount() {
    const { count, error } = await supabase
        .from('infrastructure_projects')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching count:', error);
    } else {
        console.log(`infrastructure_projects count: ${count}`);
    }
}

checkCount();
