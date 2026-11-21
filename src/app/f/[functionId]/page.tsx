import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar, MapPin, Users, Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

interface FunctionPageProps {
  params: Promise<{ functionId: string }>;
}

export default async function FunctionDetailPage({
  params,
}: FunctionPageProps) {
  const { functionId } = await params;
  const supabase = await createClient();

  // Fetch function details
  const { data: fn, error } = await supabase
    .from("functions")
    .select("*")
    .eq("id", functionId)
    .single();

  if (error || !fn) {
    notFound();
  }

  // Count invited guests for this function
  const { count: invitedCount } = await supabase
    .from("function_guests")
    .select("*", { count: "exact", head: true })
    .eq("function_id", functionId);

  // Count confirmed RSVPs
  const { count: confirmedCount } = await supabase
    .from("function_guests")
    .select("*", { count: "exact", head: true })
    .eq("function_id", functionId)
    .eq("rsvp_status", "confirmed");

  // Fetch payments for this function
  const { data: payments } = await supabase
    .from("payments")
    .select("amount_paise")
    .eq("function_id", functionId);

  const totalPaise =
    payments?.reduce((acc: number, p: any) => acc + Number(p.amount_paise), 0) ?? 0;
  const formattedExpenses = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalPaise / 100);

  return (
    <main className="p-4 sm:p-6 space-y-5">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 min-h-[44px] px-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Events
        </Link>
      </div>

      {/* Function Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">
          Function Dashboard
        </span>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          {fn.name}
        </h1>
        <div className="space-y-1.5 text-sm text-stone-600 pt-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>{fn.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-stone-400" />
            <span>{fn.venue}</span>
          </div>
        </div>
        {fn.notes && (
          <p className="text-xs text-stone-500 pt-2 border-t border-stone-100">
            {fn.notes}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-xl font-bold text-stone-900">{invitedCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-0.5">Invited</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-xl font-bold text-emerald-700">{confirmedCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-0.5">Confirmed</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-base font-bold text-stone-900 truncate">{formattedExpenses}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-0.5">Expenses</div>
        </div>
      </div>
    </main>
  );
}
