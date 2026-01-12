import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RiskBadge } from "@/components/RiskBadge";
import { 
  Shield, 
  MapPin, 
  Bell, 
  FileText, 
  ArrowRight, 
  Building2, 
  Train, 
  Plane, 
  Factory,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Location-Based Risk Analysis",
    description: "Enter any property location in India and get instant risk assessment based on nearby infrastructure projects.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Subscribe to alerts for new government projects, notifications, and risk changes in areas you care about.",
  },
  {
    icon: FileText,
    title: "Legal Resources",
    description: "Access case laws, compensation guidelines, and legal templates to protect your property rights.",
  },
  {
    icon: Shield,
    title: "Compensation Estimates",
    description: "Get estimated compensation values based on recent land acquisition cases in your state.",
  },
];

const projectTypes = [
  { icon: Building2, label: "Highways", count: "450+" },
  { icon: Train, label: "Railways", count: "280+" },
  { icon: Plane, label: "Airports", count: "65+" },
  { icon: Factory, label: "Industrial", count: "190+" },
];

const stats = [
  { value: "50,000+", label: "Properties Assessed" },
  { value: "1,000+", label: "Infrastructure Projects" },
  { value: "28", label: "States Covered" },
  { value: "98%", label: "Accuracy Rate" },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in">
                <Shield className="h-4 w-4" />
                <span>Trusted by 50,000+ property buyers</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                Know Before You Buy
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Protect your family's investment. Check if your dream property is in the path of upcoming government infrastructure projects before making a purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button variant="glass" size="xl" asChild>
                  <Link to="/assess" className="gap-2">
                    Check Property Risk
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                  <Link to="/projects">View Projects Map</Link>
                </Button>
              </div>
            </div>

            {/* Risk Level Preview */}
            <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <RiskBadge level="very_low" />
              <RiskBadge level="low" />
              <RiskBadge level="medium" />
              <RiskBadge level="high" />
              <RiskBadge level="critical" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b bg-background">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Types */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Infrastructure Projects We Track</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We monitor all major government infrastructure projects that may affect land acquisition across India.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {projectTypes.map((type, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <type.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-lg">{type.label}</h3>
                  <p className="text-2xl font-bold text-primary mt-1">{type.count}</p>
                  <p className="text-xs text-muted-foreground">Active Projects</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Protect Your Investment</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools and resources to help you make informed property decisions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-xl border bg-card hover:shadow-medium transition-all hover:-translate-y-1"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your property risk assessment in three simple steps.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "1", title: "Enter Location", description: "Provide the property address or select the location on map" },
                { step: "2", title: "Get Risk Score", description: "Our system analyzes proximity to government projects" },
                { step: "3", title: "Take Action", description: "View recommendations and set up alerts for updates" },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-medium">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Trust LARAS?</h2>
                <ul className="space-y-4">
                  {[
                    "Data sourced directly from government portals",
                    "Real-time updates on project notifications",
                    "Verified by legal experts",
                    "Used by property lawyers and agents",
                    "Transparent methodology",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" size="lg" asChild>
                  <Link to="/auth?mode=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-6 border shadow-soft">
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <div className="text-2xl font-bold">4.8/5</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
                <div className="bg-card rounded-xl p-6 border shadow-soft">
                  <TrendingUp className="h-8 w-8 text-accent mb-3" />
                  <div className="text-2xl font-bold">₹2.5Cr+</div>
                  <div className="text-sm text-muted-foreground">Saved by Users</div>
                </div>
                <div className="col-span-2 bg-primary text-primary-foreground rounded-xl p-6 shadow-medium">
                  <p className="text-lg font-medium mb-2">"LARAS helped me avoid buying land that was later acquired for highway expansion."</p>
                  <p className="text-sm opacity-80">— Rajesh K., Property Buyer, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't Let Your Dream Property Become a Nightmare
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Join thousands of smart property buyers who check land acquisition risks before investing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glass" size="xl" asChild>
                <Link to="/assess">
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
