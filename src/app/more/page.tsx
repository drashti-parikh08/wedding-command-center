import { createClient } from "@/lib/supabase/server";
import { User, Shield, Info, LogOut } from "lucide-react";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

export default async function MorePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  return (
    <main className="p-4 sm:p-6 space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Settings & Account
        </h1>
        <p className="text-sm text-stone-500">
          Profile details & app preferences
        </p>
      </header>

      {/* User Profile Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-lg">
            {user?.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <h2 className="font-semibold text-stone-900 text-sm">{user?.email}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs text-stone-500 capitalize">
                Role: <strong className="text-stone-700">{profile?.role ?? "family"}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* App Info Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-sm">
        <h3 className="font-bold text-stone-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-stone-500" />
          About Wedding Command Center
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed">
          Private Progressive Web App (PWA) built for family event management. Designed for mobile browsers with Rs 0 operating cost.
        </p>
        <div className="text-xs text-stone-400 pt-2 border-t border-stone-100">
          Version 0.2.0 • Phase 2 Auth & App Shell
        </div>
      </div>

      {/* Logout Action */}
      <LogoutButton />
    </main>
  );
}
