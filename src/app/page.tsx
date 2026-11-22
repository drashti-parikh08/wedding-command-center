import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar, PartyPopper } from "lucide-react";

export const dynamic = "force-dynamic";

// Change these when the real names are decided
const BRIDE = "[Bride]";
const GROOM = "[Groom]";
const SUBTITLE = "Wedding Celebrations 2026";

const TILE_COLORS = ["bg-peach", "bg-sage-light", "bg-lavender", "bg-powder"];

function formatDate(date: string | null) {
  if (!date) return "Date to be announced";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: functions } = await supabase
    .from("functions")
    .select("*")
    .order("sort_order", { ascending: true });

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

  const stats = [
    { label: "Guests", value: guestCount ?? 0 },
    { label: "Households", value: householdCount ?? 0 },
    { label: "Delivered", value: deliveredCount ?? 0 },
  ];

  return (
    <main className="mx-auto max-w-md px-4 pt-4">
      <div className="rounded-t-full bg-rose p-2 pb-0">
        <div className="min-h-[calc(100vh-1rem)] rounded-t-full bg-cream px-4 pb-28 pt-14">
          <div className="text-center">
            <p className="font-serif text-xs font-semibold tracking-wide">
              || Shree Ganesh Namah ||
            </p>
            <h1 className="mt-1 font-script text-4xl leading-tight">
              {BRIDE} <span className="font-serif text-xl">&amp;</span> {GROOM}
            </h1>
            <div className="mx-auto my-2 h-px w-20 bg-gold/60" />
            <p className="font-serif text-base">{SUBTITLE}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              Signed in as {user?.email}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gold/30 bg-background px-2 py-2 text-center"
              >
                <p className="font-serif text-2xl leading-none">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-4 text-center font-script text-3xl">Functions</h2>

          <ul className="mt-2 space-y-2">
            {functions && functions.length > 0 ? (
              functions.map((fn, i) => (
                <li key={fn.id}>
                  <Link
                    href={`/f/${fn.id}`}
                    className="flex min-h-14 items-center gap-3 rounded-2xl border border-gold/30 bg-background px-3 py-2 active:scale-[0.99]"
                  >
                    <div
                      className={
                        "flex h-11 w-10 shrink-0 items-center justify-center rounded-t-full rounded-b-md " +
                        TILE_COLORS[i % TILE_COLORS.length]
                      }
                    >
                      <PartyPopper className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg leading-tight">
                        {fn.name}
                      </p>
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {formatDate(fn.date)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-background p-3 text-center text-base text-muted-foreground">
                No functions configured yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}