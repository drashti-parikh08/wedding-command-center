"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  payment: {
    id: string;
    title: string;
    payee_text: string;
    amount_paise: number;
    status: string;
  };
};

export default function EditBill({ payment }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(
    payment.title === "Bill photo" ? "" : payment.title
  );
  const [payee, setPayee] = useState(
    payment.payee_text === "Not filled" ? "" : payment.payee_text
  );
  const [amount, setAmount] = useState(
    payment.amount_paise > 0 ? String(payment.amount_paise / 100) : ""
  );
  const [status, setStatus] = useState(payment.status);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const inputClass =
    "min-h-12 w-full rounded-xl border border-gold/30 bg-cream px-4 text-base outline-none focus:ring-2 focus:ring-gold";

  async function save() {
    setMessage("");
    const rupees = parseFloat(amount.replace(/,/g, ""));
    const amountPaise = Number.isFinite(rupees) ? Math.round(rupees * 100) : 0;

    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("payments")
      .update({
        title: title.trim() || "Bill photo",
        payee_text: payee.trim() || "Not filled",
        amount_paise: amountPaise,
        status,
      })
      .eq("id", payment.id)
      .select("id");
    setBusy(false);

    if (error) {
      setMessage("Could not save: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      setMessage("Nothing was saved. You may not have permission.");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 min-h-12 w-full rounded-xl border border-gold/30 bg-cream text-base"
      >
        Edit details
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <input
        className={inputClass}
        placeholder="What is it for?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Paid to"
        value={payee}
        onChange={(e) => setPayee(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Amount in rupees"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        className={inputClass}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="advance">Advance</option>
      </select>

      {message && <p className="text-base">{message}</p>}

      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="min-h-12 w-full rounded-xl bg-ink text-base text-cream disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save changes"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        disabled={busy}
        className="min-h-12 w-full rounded-xl border border-gold/30 bg-cream text-base"
      >
        Cancel
      </button>
    </div>
  );
}
