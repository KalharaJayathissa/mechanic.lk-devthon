import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background-light dark:bg-background-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full flex flex-col gap-6">
        <div className="h-24 w-24 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 rotate-3">
          <span className="material-symbols-outlined text-white text-[48px]">car_repair</span>
        </div>

        <div>
          <h1 className="text-4xl font-black text-text-main dark:text-white mb-2 tracking-tight">Mechanic.LK</h1>
          <p className="text-text-sub text-lg font-medium">Your all-in-one automotive ecosystem.</p>
        </div>

        <div className="flex flex-col gap-3 w-full pt-8">
          <Link href="/register" className="w-full">
            <Button className="w-full" size="lg">Get Started</Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button className="w-full" variant="ghost">Log In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
