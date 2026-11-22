import { createClient } from "@/lib/supabase/server";
import AddBillForm from "./add-bill-form";

export const dynamic = "force-dynamic";

type Payment = {
  id: string;
  title: string;
  payee_text: string;
  amount_paise: number;
  paid_on: string;
  status: string;
  functions: { name: string } | { name: string }[] | null;
  payment_attachments: { id: string }[] | null;
};

function fnName(f: Payment["functions"]) {
  if (!f) return "";
  return Array.isArray(f) ? (f[0]?.name ?? "") : f.name;
}

function rupees(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

export default async function BillsPage() {
  const supabase = await createClient();

  const { data: fns } = await supabase
    .from("functions")
    .select("id, name")
    .order("sort_order", { ascending: true });

  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, title, payee_text, amount_paise, paid_on, status, functions(name), payment_attachments(id)"
    )
    .order("created_at", { ascending: false });

  const payments = (data ?? []) as unknown as Payment[];
  const total = payments.reduce((sum, p) => sum + Number(p.amount_paise), 0);

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-8">
      <h1 className="text-center font-script text-5xl">Bills</h1>
      <p className="mt-1 text-center font-serif text-lg text-muted-foreground">
        Payments and receipts
      </p>

      <div className="mt-6 rounded-2xl border border-gold/30 bg-cream p-4 text-center shadow-sm">
        <p className="font-serif text-4xl">{rupees(total)}</p>
        <p className="text-base text-muted-foreground">
          total across {payments.length} bills
        </p>
      </div>

      <AddBillForm functions={fns ?? []} />

      {error && (
        <p className="mt-4 rounded-2xl bg-cream p-4 text-base">
          Could not load bills: {error.message}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {payments.map((p) => {
          const needsDetails = p.amount_paise === 0 || p.title === "Bill photo";
          const photos = p.payment_attachments?.length ?? 0;
          return (
            <li
              key={p.id}
              className="rounded-2xl border border-gold/30 bg-cream p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl">{p.title}</p>
                  <p className="text-base text-muted-foreground">
                    {[fnName(p.functions), p.payee_text]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <p className="font-serif text-xl">{rupees(p.amount_paise)}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {needsDetails && (
                  <span className="rounded-full bg-peach px-3 py-1 text-sm">
                    Needs details
                  </span>
                )}
                {photos > 0 && (
                  <span className="rounded-full bg-sage-light px-3 py-1 text-sm">
                    Photo attached
                  </span>
                )}
                <span className="rounded-full bg-lavender px-3 py-1 text-sm">
                  {p.status}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}