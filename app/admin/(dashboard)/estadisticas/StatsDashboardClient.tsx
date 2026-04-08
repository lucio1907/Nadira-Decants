"use client";

import { StatsDashboard } from "@/components/admin/StatsDashboard";
import { useRouter, usePathname } from "next/navigation";

export function StatsDashboardClient({ initialData, initialDays }: { initialData: any, initialDays: number }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDaysChange = (days: number) => {
    // We use searchParams to trigger a server-side re-fetch in the Page
    router.push(`${pathname}?days=${days}`, { scroll: false });
  };

  return <StatsDashboard data={initialData} days={initialDays} onDaysChange={handleDaysChange} />;
}
