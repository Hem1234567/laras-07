import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, signOut, user } = useAuth();
  const navigate = useNavigate();
  const isSigningUpRef = useRef(false);

  useEffect(() => {
    // Only redirect if we are not currently simulating a sign out after sign up
    if (user && !isSigningUpRef.current) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = signUpSchema.safeParse(formData);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0].toString()] = err.message;
            }
          });
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        isSigningUpRef.current = true;
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          isSigningUpRef.current = false;
          if (error.message.includes("already registered")) {
            setError("This email is already registered. Please sign in instead.");
          } else {
            setError(error.message);
          }
        } else {
          // Force sign out to prevent auto-login
          await signOut();
          isSigningUpRef.current = false;
          setSuccess("Account created successfully! Please sign in.");
          setIsSignUp(false);
          setFormData({ ...formData, password: "", confirmPassword: "" });
        }
      } else {
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0].toString()] = err.message;
            }
          });
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error("Login error:", error);
          if (error.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            setError("Please verify your email address before signing in.");
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">LARAS</span>
            </Link>
            <CardTitle className="text-2xl">
              {isSignUp ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Start protecting your property investments today"
                : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={fieldErrors.fullName ? "border-destructive" : ""}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={fieldErrors.email ? "border-destructive" : ""}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={fieldErrors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-destructive">{fieldErrors.password}</p>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={fieldErrors.confirmPassword ? "border-destructive" : ""}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              {isSignUp ? (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/auth" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/auth?mode=signup" className="text-primary font-medium hover:underline">
                    Create one
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">
            Protect Your Property Investment
          </h2>
          <p className="text-lg opacity-80 mb-8">
            Get instant risk assessments, real-time alerts, and legal resources to make informed property decisions.
          </p>
          <ul className="space-y-3">
            {[
              "Check land acquisition risk for any location",
              "Real-time project notifications",
              "Compensation estimates based on recent cases",
              "Access to legal templates and resources",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-white/80" />
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
