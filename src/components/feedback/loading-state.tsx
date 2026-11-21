import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center min-h-[200px] ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-8 h-8 animate-spin text-stone-500 mb-3" />
      <p className="text-stone-600 text-sm font-medium">{message}</p>
    </div>
  );
}
