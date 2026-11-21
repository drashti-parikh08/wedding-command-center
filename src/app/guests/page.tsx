import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Guest = {
  id: string;
  full_name: string;
  city: string | null;
  notes: string | null;
  households: { name: string } | { name: string }[] | null;
};

function householdName(h: Guest["households"]) {
  if (!h) return "";
  return Array.isArray(h) ? (h[0]?.name ?? "") : h.name;
}

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = (q ?? "").replace(/[,()%]/g, " ").trim();

  const supabase = await createClient();

  const { count: totalGuests } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true });

  let query = supabase
    .from("guests")
    .select("id, full_name, city, notes, households(name)")
    .order("full_name", { ascending: true })
    .limit(200);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,city.ilike.%${search}%`);
  }

  const { data, error } = await query;
  const guests = (data ?? []) as Guest[];

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-8">
      <h1 className="text-center font-script text-5xl">Guests</h1>
      <p className="mt-1 text-center font-serif text-lg text-muted-foreground">
        {totalGuests ?? 0} guests in total
      </p>

      <form method="get" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by name or city"
          className="min-h-12 w-full rounded-xl border border-gold/30 bg-cream px-4 text-base outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-ink px-5 text-base text-cream"
        >
          Search
        </button>
      </form>

      {search && (
        <p className="mt-3 text-base text-muted-foreground">
          {guests.length} result{guests.length === 1 ? "" : "s"} for &quot;
          {search}&quot;
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-cream p-4 text-base">
          Could not load guests: {error.message}
        </p>
      )}

      {!error && guests.length === 0 && (
        <p className="mt-4 rounded-2xl bg-cream p-4 text-base text-muted-foreground">
          No guests found.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {guests.map((g) => (
          <li
            key={g.id}
            className="rounded-2xl border border-gold/30 bg-cream p-4 shadow-sm"
          >
            <p className="font-serif text-xl">{g.full_name}</p>
            <p className="text-base text-muted-foreground">
              {[householdName(g.households), g.city]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {g.notes && (
              <span className="mt-2 inline-block rounded-full bg-lavender px-3 py-1 text-sm">
                {g.notes}
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}