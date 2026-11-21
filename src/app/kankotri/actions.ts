"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setStatus(formData: FormData) {
  const householdId = String(formData.get("householdId"));
  const status = String(formData.get("status"));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("kankotri_visits").upsert(
    {
      household_id: householdId,
      status,
      visited_on: status === "delivered" ? new Date().toISOString() : null,
      visited_by: user?.id ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "household_id" }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/kankotri");
}