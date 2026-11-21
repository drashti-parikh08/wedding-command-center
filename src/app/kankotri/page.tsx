import { createClient } from "@/lib/supabase/server";
import { setStatus } from "./actions";

export const dynamic = "force-dynamic";

type Visit = { status: string } | { status: string }[] | null;

type Household = {
  id: string;
  name: string;
  city: string;
  area: string | null;
  kankotri_visits: Visit;
};

function getStatus(visit: Visit) {
  if (!visit) return "not_visited";
  if (Array.isArray(visit)) return visit[0]?.status ?? "not_visited";
  return visit.status;
}

export default async function KankotriPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("households")
    .select("id, name, city, area, kankotri_visits(status)")
    .order("name", { ascending: true });

  const households = (data ?? []) as Household[];
  const total = households.length;
  const delivered = households.filter(
    (h) => getStatus(h.kankotri_visits) === "delivered"
  ).length;
  const remaining = total - delivered;

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-8">
      <h1 className="text-center font-script text-5xl">Kankotri</h1>
      <p className="mt-1 text-center font-serif text-lg text-muted-foreground">
        Invitation delivery checklist
      </p>

      <div className="mt-6 rounded-2xl border border-gold/30 bg-cream p-4 text-center shadow-sm">
        <p className="font-serif text-5xl">{remaining}</p>
        <p className="text-base text-muted-foreground">
          remaining ({delivered} of {total} delivered)
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-cream p-4 text-base">
          Could not load households: {error.message}
        </p>
      )}

      {!error && total === 0 && (
        <p className="mt-4 rounded-2xl bg-cream p-4 text-base text-muted-foreground">
          No households yet.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {households.map((h) => {
          const status = getStatus(h.kankotri_visits);
          const isDelivered = status === "delivered";
          return (
            <li
              key={h.id}
              className="rounded-2xl border border-gold/30 bg-cream p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl">{h.name}</p>
                  <p className="text-base text-muted-foreground">
                    {[h.area, h.city].filter(Boolean).join(", ")}
                  </p>
                </div>
                <span
                  className={
                    "rounded-full px-3 py-1 text-sm " +
                    (isDelivered ? "bg-sage-light" : "bg-peach")
                  }
                >
                  {isDelivered ? "Delivered" : "Pending"}
                </span>
              </div>

              <form action={setStatus} className="mt-3">
                <input type="hidden" name="householdId" value={h.id} />
                <input
                  type="hidden"
                  name="status"
                  value={isDelivered ? "not_visited" : "delivered"}
                />
                <button
                  type="submit"
                  className={
                    "min-h-12 w-full rounded-xl text-base " +
                    (isDelivered
                      ? "border border-gold/30 bg-cream text-foreground"
                      : "bg-ink text-cream")
                  }
                >
                  {isDelivered ? "Undo" : "Mark delivered"}
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </main>
  );
}