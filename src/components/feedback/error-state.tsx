import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Try Again",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-950 mb-1">{title}</h3>
      <p className="text-sm text-rose-800 max-w-xs mb-4">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="min-h-[48px] px-6 text-sm border-rose-300 text-rose-900 hover:bg-rose-100"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
