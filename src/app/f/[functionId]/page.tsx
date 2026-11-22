import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(date: string | null) {
  if (!date) return "Date to be announced";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function rupees(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

export default async function FunctionPage({
  params,
}: {
  params: Promise<{ functionId: string }>;
}) {
  const { functionId } = await params;
  const supabase = await createClient();

  const { data: fn } = await supabase
    .from("functions")
    .select("*")
    .eq("id", functionId)
    .maybeSingle();

  if (!fn) notFound();

  const { data: fg } = await supabase
    .from("function_guests")
    .select("rsvp_status")
    .eq("function_id", functionId);

  const { data: pay } = await supabase
    .from("payments")
    .select("id, title, payee_text, amount_paise, status")
    .eq("function_id", functionId)
    .order("created_at", { ascending: false });

  const invited = fg?.length ?? 0;
  const confirmed = (fg ?? []).filter((g) => g.rsvp_status === "confirmed").length;
  const bills = pay ?? [];
  const spent = bills.reduce((sum, p) => sum + Number(p.amount_paise), 0);

  const stats = [
    { label: "Invited", value: String(invited) },
    { label: "Confirmed", value: String(confirmed) },
    { label: "Spent", value: rupees(spent) },
  ];

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-4">
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-1 text-base text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <div className="rounded-t-full rounded-b-3xl bg-rose p-2">
        <div className="rounded-t-full rounded-b-[1.25rem] bg-cream px-5 pb-6 pt-16 text-center">
          <h1 className="font-script text-5xl leading-tight">{fn.name}</h1>
          <div className="mx-auto my-2 h-px w-20 bg-gold/60" />
          <p className="flex items-center justify-center gap-1.5 font-serif text-lg">
            <Calendar className="h-4 w-4" />
            {formatDate(fn.date)}
          </p>
          {fn.venue && (
            <p className="mt-1 flex items-center justify-center gap-1.5 text-base text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {fn.venue}
            </p>
          )}
          {fn.notes && (
            <p className="mt-3 text-base text-muted-foreground">{fn.notes}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gold/30 bg-cream px-2 py-3 text-center shadow-sm"
          >
            <p className="font-serif text-2xl leading-none">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-center font-script text-3xl">Bills</h2>

      <ul className="mt-3 space-y-2">
        {bills.length === 0 && (
          <li className="rounded-2xl bg-cream p-4 text-center text-base text-muted-foreground">
            No bills for this function yet.
          </li>
        )}
        {bills.map((p) => (
          <li
            key={p.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-gold/30 bg-cream p-3 shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-serif text-lg">{p.title}</p>
              <p className="truncate text-base text-muted-foreground">
                {p.payee_text} · {p.status}
              </p>
            </div>
            <p className="font-serif text-lg">{rupees(Number(p.amount_paise))}</p>
          </li>
        ))}
      </ul>

      <Link
        href="/bills"
        className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-ink text-base text-cream"
      >
        Go to Bills to add one
      </Link>
    </main>
  );
}