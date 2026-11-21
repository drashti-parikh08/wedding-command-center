"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      alert("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="w-full min-h-[48px] text-base font-semibold border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Signing out...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Sign Out
        </span>
      )}
    </Button>
  );
}
