import { UmamiDashboardClient } from "./UmamiDashboardClient";

export const metadata = {
  title: "Métricas Web | Admin",
};

export default function MetricasPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <UmamiDashboardClient />
    </div>
  );
}
