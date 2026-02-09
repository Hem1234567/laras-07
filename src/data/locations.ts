// Simplified database of Indian States and Districts with Coordinates
// In a real app, this would be fetched from an API

export interface City {
    name: string;
    lat: number;
    lng: number;
    localities: string[];
}

export interface District {
    name: string;
    cities: City[];
}

export interface State {
    name: string;
    districts: District[];
}

export const INDIAN_LOCATIONS: State[] = [
    {
        name: "Andhra Pradesh",
        districts: [
            {
                name: "Visakhapatnam",
                cities: [{ name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, localities: ["Gajuwaka", "Madhurawada", "Seethammadhara", "MVP Colony", "Siripuram"] }]
            },
            {
                name: "Krishna",
                cities: [{ name: "Vijayawada", lat: 16.5062, lng: 80.6480, localities: ["Benz Circle", "Patamata", "Gunadala", "Bhavanipuram"] }]
            },
            {
                name: "Guntur",
                cities: [{ name: "Guntur", lat: 16.3067, lng: 80.4365, localities: ["Amaravathi", "Gorantla", "Vidyanagar", "Arundelpet"] }]
            },
        ]
    },
    {
        name: "Delhi",
        districts: [
            {
                name: "New Delhi",
                cities: [{ name: "New Delhi", lat: 28.6139, lng: 77.2090, localities: ["Connaught Place", "Chanakyapuri", "Vasant Vihar", "Jor Bagh"] }]
            },
            {
                name: "South Delhi",
                cities: [{ name: "Saket", lat: 28.5244, lng: 77.2188, localities: ["Saket", "Malviya Nagar", "Hauz Khas", "Greater Kailash"] }]
            },
            {
                name: "North Delhi",
                cities: [{ name: "Rohini", lat: 28.7041, lng: 77.1025, localities: ["Rohini Sector 13", "Pitampura", "Model Town", "Shalimar Bagh"] }]
            },
        ]
    },
    {
        name: "Karnataka",
        districts: [
            {
                name: "Bangalore Urban",
                cities: [{ name: "Bangalore", lat: 12.9716, lng: 77.5946, localities: ["Koramangala", "Indiranagar", "Whitefield", "Jayanagar", "HSR Layout", "Electronic City", "Malleshwaram"] }]
            },
            {
                name: "Mysore",
                cities: [{ name: "Mysore", lat: 12.2958, lng: 76.6394, localities: ["Vijayanagar", "Gokulam", "Saraswathipuram", "Kuvempunagar"] }]
            },
            {
                name: "Dakshina Kannada",
                cities: [{ name: "Mangalore", lat: 12.9141, lng: 74.8560, localities: ["Kadri", "Bejai", "Kankanady", "Urwa"] }]
            },
        ]
    },
    {
        name: "Maharashtra",
        districts: [
            {
                name: "Mumbai City",
                cities: [{ name: "Mumbai", lat: 19.0760, lng: 72.8777, localities: ["Colaba", "Fort", "Marine Lines", "Malabar Hill"] }]
            },
            {
                name: "Mumbai Suburban",
                cities: [{ name: "Mumbai (Suburban)", lat: 19.1136, lng: 72.8697, localities: ["Bandra", "Andheri", "Juhu", "Goregaon", "Borivali", "Powai"] }]
            },
            {
                name: "Pune",
                cities: [{ name: "Pune", lat: 18.5204, lng: 73.8567, localities: ["Kothrud", "Viman Nagar", "Kalyani Nagar", "Hinjewadi", "Aundh", "Baner"] }]
            },
            {
                name: "Nagpur",
                cities: [{ name: "Nagpur", lat: 21.1458, lng: 79.0882, localities: ["Dharampeth", "Sitabuldi", "Sadar", "Civil Lines"] }]
            },
        ]
    },
    {
        name: "Tamil Nadu",
        districts: [
            {
                name: "Chennai",
                cities: [{ name: "Chennai", lat: 13.0827, lng: 80.2707, localities: ["Adyar", "Anna Nagar", "T Nagar", "Velachery", "OMR", "Mylapore"] }]
            },
            {
                name: "Coimbatore",
                cities: [{ name: "Coimbatore", lat: 11.0168, lng: 76.9558, localities: ["RS Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony"] }]
            },
            {
                name: "Madurai",
                cities: [{ name: "Madurai", lat: 9.9252, lng: 78.1198, localities: ["KK Nagar", "Anna Nagar", "TVS Nagar", "Simmakkal"] }]
            },
        ]
    },
    {
        name: "Telangana",
        districts: [
            {
                name: "Hyderabad",
                cities: [{ name: "Hyderabad", lat: 17.3850, lng: 78.4867, localities: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Hitech City", "Kukatpally", "Begumpet"] }]
            },
            {
                name: "Ranga Reddy",
                cities: [{ name: "Hyderabad (RR)", lat: 17.3297, lng: 78.4347, localities: ["Manikonda", "Narsingi", "Kismatpur", "Rajendranagar"] }]
            },
        ]
    },
    {
        name: "Uttar Pradesh",
        districts: [
            {
                name: "Gautam Buddha Nagar",
                cities: [
                    { name: "Noida", lat: 28.5355, lng: 77.3910, localities: ["Sector 18", "Sector 62", "Sector 137", "Sector 150"] },
                    { name: "Greater Noida", lat: 28.4744, lng: 77.5040, localities: ["Alpha 1", "Beta 2", "Tech Zone", "Pari Chowk"] }
                ]
            },
            {
                name: "Lucknow",
                cities: [{ name: "Lucknow", lat: 26.8467, lng: 80.9462, localities: ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar"] }]
            },
            {
                name: "Ghaziabad",
                cities: [{ name: "Ghaziabad", lat: 28.6692, lng: 77.4538, localities: ["Indirapuram", "Vaishali", "Raj Nagar", "Kavi Nagar"] }]
            },
        ]
    },
    // Add other states with empty districts if needed for full list
    { name: "Arunachal Pradesh", districts: [] },
    { name: "Assam", districts: [] },
    { name: "Bihar", districts: [] },
    { name: "Chhattisgarh", districts: [] },
    { name: "Goa", districts: [] },
    { name: "Gujarat", districts: [] },
    { name: "Haryana", districts: [] },
    { name: "Himachal Pradesh", districts: [] },
    { name: "Jharkhand", districts: [] },
    { name: "Kerala", districts: [] },
    { name: "Madhya Pradesh", districts: [] },
    { name: "Manipur", districts: [] },
    { name: "Meghalaya", districts: [] },
    { name: "Mizoram", districts: [] },
    { name: "Nagaland", districts: [] },
    { name: "Odisha", districts: [] },
    { name: "Punjab", districts: [] },
    { name: "Rajasthan", districts: [] },
    { name: "Sikkim", districts: [] },
    { name: "Tripura", districts: [] },
    { name: "Uttarakhand", districts: [] },
    { name: "West Bengal", districts: [] },
    { name: "Jammu and Kashmir", districts: [] },
    { name: "Ladakh", districts: [] },
    { name: "Puducherry", districts: [] },
    { name: "Chandigarh", districts: [] },
    { name: "Andaman and Nicobar Islands", districts: [] },
    { name: "Dadra and Nagar Haveli", districts: [] },
    { name: "Daman and Diu", districts: [] },
    { name: "Lakshadweep", districts: [] },
];

export const PROPERTY_SIZES = [
    { value: "600", label: "600 sq.ft (20x30)" },
    { value: "1200", label: "1,200 sq.ft (30x40)" },
    { value: "1500", label: "1,500 sq.ft (30x50)" },
    { value: "2400", label: "2,400 sq.ft (40x60)" },
    { value: "4000", label: "4,000 sq.ft (50x80)" },
    { value: "5000", label: "5,000 sq.ft" },
    { value: "10890", label: "0.25 Acre" },
    { value: "21780", label: "0.5 Acre" },
    { value: "43560", label: "1 Acre" },
];
