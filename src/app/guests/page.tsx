import { createClient } from "@/lib/supabase/server";
import { Users, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const supabase = await createClient();

  const { count: totalGuests } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true });

  const { data: sampleGuests } = await supabase
    .from("guests")
    .select("id, full_name, city, notes, households(name)")
    .limit(8);

  return (
    <main className="p-4 sm:p-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Guest Directory
          </h1>
          <p className="text-sm text-stone-500">
            {totalGuests ?? 0} total guests invited
          </p>
        </div>
        <div className="p-2.5 rounded-full bg-rose-50 text-rose-700">
          <Users className="w-5 h-5" />
        </div>
      </header>

      {/* Mock Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          placeholder="Search by guest or household name..."
          disabled
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 opacity-80"
        />
      </div>

      {/* Sample Guest List Preview */}
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 shadow-xs overflow-hidden">
        {sampleGuests && sampleGuests.length > 0 ? (
          sampleGuests.map((guest: any) => (
            <div key={guest.id} className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-stone-900 text-sm">
                  {guest.full_name}
                </div>
                <div className="text-xs text-stone-500">
                  {guest.households?.name} • {guest.city}
                </div>
              </div>
              {guest.notes && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                  {guest.notes}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-stone-500">
            No guests found.
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
        💡 Full search, multi-city filters, RSVP badges, and Excel import will be enabled in <strong>Phase 4</strong>.
      </div>
    </main>
  );
}
