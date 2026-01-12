import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">LARAS</span>
                <span className="text-[10px] text-muted-foreground leading-none">Land Risk Awareness</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering Indian families to make informed property investment decisions by understanding land acquisition risks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/assess" className="hover:text-foreground transition-colors">Risk Assessment</Link></li>
              <li><Link to="/projects" className="hover:text-foreground transition-colors">Infrastructure Projects</Link></li>
              <li><Link to="/resources" className="hover:text-foreground transition-colors">Legal Resources</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
              <li><Link to="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@laras.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1800-XXX-XXXX
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LARAS. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Data sourced from Government of India portals. For informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
