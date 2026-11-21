import { createClient } from "@/lib/supabase/server";
import { Mail, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KankotriPage() {
  const supabase = await createClient();

  const { count: totalHouseholds } = await supabase
    .from("households")
    .select("*", { count: "exact", head: true });

  const { count: deliveredCount } = await supabase
    .from("kankotri_visits")
    .select("*", { count: "exact", head: true })
    .eq("status", "delivered");

  const { count: revisitCount } = await supabase
    .from("kankotri_visits")
    .select("*", { count: "exact", head: true })
    .eq("status", "needs_revisit");

  const remaining = (totalHouseholds ?? 0) - (deliveredCount ?? 0);

  return (
    <main className="p-4 sm:p-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Kankotri Checklist
          </h1>
          <p className="text-sm text-stone-500">
            Household invitation visit tracking
          </p>
        </div>
        <div className="p-2.5 rounded-full bg-rose-50 text-rose-700">
          <Mail className="w-5 h-5" />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-xl font-bold text-rose-700">{deliveredCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 flex items-center justify-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-xl font-bold text-amber-600">{revisitCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 flex items-center justify-center gap-1 mt-0.5">
            <AlertCircle className="w-3 h-3 text-amber-500" /> Revisit
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-xl font-bold text-stone-800">{remaining}</div>
          <div className="text-[11px] font-medium text-stone-500 flex items-center justify-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-stone-400" /> Left
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
        <Mail className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="font-semibold text-stone-900 text-base mb-1">
          Kankotri Delivery Module
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
          One-tap &quot;Mark Delivered&quot;, address notes, and live remaining counts will be active in <strong>Phase 5</strong>.
        </p>
      </div>
    </main>
  );
}
