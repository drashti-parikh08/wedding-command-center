import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-stone-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-200 flex flex-col items-center gap-4">
        <div className="text-sm font-semibold tracking-wider text-rose-700 uppercase">
          || Shree Ganesh Namah ||
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Wedding Command Center
        </h1>
        <p className="text-stone-600 text-sm">
          Phase 0 Setup Complete. Next.js, Tailwind CSS, and shadcn/ui are ready.
        </p>
        <div className="pt-2">
          <Button variant="default">Foundation Ready</Button>
        </div>
      </div>
    </main>
  );
}
