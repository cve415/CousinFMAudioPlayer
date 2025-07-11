import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading broadcast..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-cousin-gray rounded-lg p-6 text-center">
        <Loader2 className="animate-spin h-12 w-12 text-cousin-orange mx-auto mb-4" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}
