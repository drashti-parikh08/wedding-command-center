import { createClient } from "@/lib/supabase/server";
import { Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("id, title, payee_text, amount_paise, paid_on, status, functions(name)")
    .order("paid_on", { ascending: false });

  const totalPaise =
    payments?.reduce((acc: number, p: any) => acc + Number(p.amount_paise), 0) ?? 0;
  const totalRupees = totalPaise / 100;

  // Format Indian rupee display: e.g. ₹ 2,95,000
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalRupees);

  return (
    <main className="p-4 sm:p-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Bills & Expenses
          </h1>
          <p className="text-sm text-stone-500">
            Total logged: <span className="font-semibold text-stone-900">{formattedTotal}</span>
          </p>
        </div>
        <div className="p-2.5 rounded-full bg-rose-50 text-rose-700">
          <Receipt className="w-5 h-5" />
        </div>
      </header>

      {/* Sample payments preview */}
      <div className="space-y-3">
        {payments && payments.length > 0 ? (
          payments.map((p: any) => {
            const amountInRs = Number(p.amount_paise) / 100;
            const formattedAmount = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(amountInRs);

            return (
              <div
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">{p.title}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {p.payee_text} • {p.functions?.name}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">{p.paid_on}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-900 text-base">
                    {formattedAmount}
                  </div>
                  <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-sm text-stone-500">
            No payments logged yet.
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
        💡 In-browser photo compression, receipt camera upload, and signed URL viewing will be enabled in <strong>Phase 6</strong>.
      </div>
    </main>
  );
}
