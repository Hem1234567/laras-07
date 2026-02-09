import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Uncaught error in ${this.props.name || 'component'}:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <AlertTriangle className="h-5 w-5" />
                        <h3>Something went wrong in {this.props.name || "this component"}</h3>
                    </div>
                    <p className="text-sm text-red-500 font-mono bg-white p-2 rounded border border-red-100 overflow-auto">
                        {this.state.error?.message}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
