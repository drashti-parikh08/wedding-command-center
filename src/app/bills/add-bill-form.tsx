"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

type Fn = { id: string; name: string };

export default function AddBillForm({ functions }: { functions: Fn[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [functionId, setFunctionId] = useState(functions[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const inputClass =
    "min-h-12 w-full rounded-xl border border-gold/30 bg-cream px-4 text-base outline-none focus:ring-2 focus:ring-gold";

  async function save() {
    setMessage("");
    const rupees = parseFloat(amount.replace(/,/g, ""));
    const amountPaise = Number.isFinite(rupees) ? Math.round(rupees * 100) : 0;

    if (!file && amountPaise === 0) {
      setMessage("Take a photo or enter an amount first.");
      return;
    }
    if (!functionId) {
      setMessage("No function found. Add functions first.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    let path: string | null = null;
    let size = 0;

    try {
      if (file) {
        const small = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          fileType: "image/jpeg",
        });
        size = small.size;
        path = `${functionId}/${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("receipts")
          .upload(path, small, { contentType: "image/jpeg" });
        if (upErr) throw new Error("Photo upload failed: " + upErr.message);
      }

      const { data: pay, error: payErr } = await supabase
        .from("payments")
        .insert({
          function_id: functionId,
          payee_text: payee.trim() || "Not filled",
          title: title.trim() || "Bill photo",
          amount_paise: amountPaise,
          status: "paid",
        })
        .select("id")
        .single();

      if (payErr || !pay) {
        if (path) await supabase.storage.from("receipts").remove([path]);
        throw new Error("Could not save bill: " + (payErr?.message ?? ""));
      }

      if (path) {
        const { error: attErr } = await supabase
          .from("payment_attachments")
          .insert({
            payment_id: pay.id,
            storage_path: path,
            mime_type: "image/jpeg",
            size_bytes: size,
          });
        if (attErr) throw new Error("Photo link failed: " + attErr.message);
      }

      setFile(null);
      setTitle("");
      setPayee("");
      setAmount("");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 min-h-14 w-full rounded-xl bg-ink text-lg text-cream"
      >
        + Add bill
      </button>
    );
  }

  return (
    <div className="mt-6 space-y-3 rounded-2xl border border-gold/30 bg-cream p-4 shadow-sm">
      <label className="block">
        <span className="mb-1 block text-base">Photo of the bill</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-base"
        />
      </label>
      {file && (
        <p className="text-base text-muted-foreground">Photo ready: {file.name}</p>
      )}

      <label className="block">
        <span className="mb-1 block text-base">Function</span>
        <select
          value={functionId}
          onChange={(e) => setFunctionId(e.target.value)}
          className={inputClass}
        >
          {functions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      <p className="text-base text-muted-foreground">Optional, fill later if busy:</p>
      <input
        className={inputClass}
        placeholder="What is it for? (e.g. Flowers)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Paid to (e.g. Floral Dreams)"
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

      {message && <p className="text-base">{message}</p>}

      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="min-h-12 w-full rounded-xl bg-ink text-base text-cream disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save bill"}
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