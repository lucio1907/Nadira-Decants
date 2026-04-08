import { getDetailedStats } from "@/lib/orders";
import { StatsDashboardClient } from "./StatsDashboardClient";

export default async function EstadisticasPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = params.days ? parseInt(params.days) : 30;
  
  // Re-fetch on server when days change via searchParams
  const stats = await getDetailedStats(days);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <StatsDashboardClient initialData={stats} initialDays={days} />
    </div>
  );
}
