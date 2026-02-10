import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const SystemError = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Error</AlertTitle>
                    <AlertDescription>
                        The application is missing required configuration to start.
                    </AlertDescription>
                </Alert>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-2">Supabase Connection Missing</h2>
                    <p className="text-gray-600 mb-4 text-sm">
                        Please ensure the following environment variables are set in your deployment configuration (e.g., Vercel Project Settings):
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded">
                        <li>VITE_SUPABASE_URL</li>
                        <li>VITE_SUPABASE_PUBLISHABLE_KEY</li>
                    </ul>
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full"
                        variant="outline"
                    >
                        Retry Connection
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SystemError;
