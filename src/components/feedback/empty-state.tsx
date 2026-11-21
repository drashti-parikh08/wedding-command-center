import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-stone-200 shadow-sm ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-stone-500 max-w-xs mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="min-h-[48px] px-6 text-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
