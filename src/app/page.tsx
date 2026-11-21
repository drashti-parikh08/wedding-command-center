import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch functions list
  const { data: functions } = await supabase
    .from("functions")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fetch quick stats
  const { count: householdCount } = await supabase
    .from("households")
    .select("*", { count: "exact", head: true });

  const { count: guestCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true });

  const { count: deliveredCount } = await supabase
    .from("kankotri_visits")
    .select("*", { count: "exact", head: true })
    .eq("status", "delivered");

  return (
    <main className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-center">
        <div className="text-xs font-semibold tracking-widest text-rose-700 uppercase mb-2">
          || Shree Ganesh Namah ||
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          [Bride] & [Groom]
        </h1>
        <p className="text-sm font-medium text-stone-600 mt-1">
          Wedding Celebrations 2026
        </p>
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
          <span>Signed in as:</span>
          <span className="font-semibold text-stone-700">{user?.email}</span>
        </div>
      </div>

      {/* Quick Summary Counts */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-2xl font-bold text-stone-900">{guestCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-0.5">Guests</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-2xl font-bold text-stone-900">{householdCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-0.5">Households</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="text-2xl font-bold text-rose-700">{deliveredCount ?? 0}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-0.5">Cards Delivered</div>
        </div>
      </div>

      {/* Functions Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-stone-900 px-1">
          Wedding Functions
        </h2>
        <div className="space-y-3">
          {functions && functions.length > 0 ? (
            functions.map((fn) => (
              <Link
                key={fn.id}
                href={`/f/${fn.id}`}
                className="block bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:border-rose-300 transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-base">
                      {fn.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{fn.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[240px]">{fn.venue}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-stone-50 text-stone-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center text-sm text-stone-500">
              No functions configured yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
