import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, ShieldAlert } from "lucide-react";

type RiskLevel = "very_low" | "low" | "medium" | "high" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string; icon: typeof CheckCircle }> = {
  very_low: {
    label: "Very Low Risk",
    className: "risk-very-low",
    icon: CheckCircle,
  },
  low: {
    label: "Low Risk",
    className: "risk-low",
    icon: CheckCircle,
  },
  medium: {
    label: "Medium Risk",
    className: "risk-medium",
    icon: AlertCircle,
  },
  high: {
    label: "High Risk",
    className: "risk-high",
    icon: AlertTriangle,
  },
  critical: {
    label: "Critical Risk",
    className: "risk-critical animate-risk-pulse",
    icon: XCircle,
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function RiskBadge({ level, showIcon = true, size = "md", className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}

export function RiskScore({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const level: RiskLevel = 
    score <= 20 ? "very_low" :
    score <= 40 ? "low" :
    score <= 60 ? "medium" :
    score <= 80 ? "high" : "critical";

  const config = riskConfig[level];
  
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold border-4",
          config.className,
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      <RiskBadge level={level} size="sm" showIcon={false} />
    </div>
  );
}
