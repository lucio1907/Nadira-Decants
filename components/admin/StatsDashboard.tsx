"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, TooltipProps
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, DollarSign, Users, AlertTriangle, 
  Download, Calendar, ArrowUpRight, Package, Zap,
  Search, Filter
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ACCENT_COLOR = '#d3b000';
const COLORS = [ACCENT_COLOR, '#4A9E5C', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

interface StatsDashboardProps {
  data: {
    kpis: {
      totalRevenue: number;
      totalOrders: number;
      approvedOrders: number;
      roi: number;
      abandonmentRate: number;
      aov: number;
    };
    salesTrend: { date: string; revenue: number }[];
    statusData: { name: string; value: number }[];
    depletionAlerts: {
      id: string;
      nombre: string;
      marca: string;
      mlTotales: number;
      mlVendidos: number;
      percentage: number;
    }[];
    topProducts: {
      nombre: string;
      marca: string;
      vendidos: number;
      revenue: number;
    }[];
  };
  days: number;
  onDaysChange: (days: number) => void;
}

export function StatsDashboard({ data, days, onDaysChange }: StatsDashboardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // A small delay ensures the parent container dimensions are calculated
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = ["Nombre", "Marca", "Vendidos", "Recaudación"];
      const rows = data.topProducts.map(p => [p.nombre, p.marca, p.vendidos, p.revenue]);
      
      let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `stats_nadira_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting CSV:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-[var(--text-display)]">Estadísticas</h1>
          <p className="text-[var(--text-secondary)] font-body text-sm uppercase tracking-widest mt-1">Panel de Control de Rendimiento</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--surface-raised)] border border-[var(--border)] rounded overflow-hidden">
            {[7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => onDaysChange(d)}
                className={`px-4 py-2 text-xs font-body font-medium transition-colors ${
                  days === d 
                  ? 'bg-[var(--accent)] text-[var(--black)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {d === 365 ? '1 Año' : `${d}D`}
              </button>
            ))}
          </div>
          
          <button 
            onClick={exportToCSV}
            disabled={isExporting}
            className="nd-btn-ghost !p-2 flex items-center gap-2"
            title="Exportar a CSV"
          >
            <Download size={18} />
            <span className="hidden sm:inline uppercase text-[10px] tracking-tighter">Exportar</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard 
          title="Recaudación" 
          value={formatCurrency(data.kpis.totalRevenue)} 
          icon={<DollarSign size={20} />} 
          subtitle="Ventas aprobadas"
        />
        <KPICard 
          title="ROI" 
          value={`${data.kpis.roi.toFixed(1)}%`} 
          icon={<TrendingUp size={20} />} 
          subtitle="Retorno de inversión"
          trend={data.kpis.roi > 50 ? 'up' : 'neutral'}
        />
        <KPICard 
          title="Ticket Promedio" 
          value={formatCurrency(data.kpis.aov)} 
          icon={<ShoppingBag size={20} />} 
          subtitle="Por orden aprobada"
        />
        <KPICard 
          title="Tasa Abandono" 
          value={`${data.kpis.abandonmentRate.toFixed(1)}%`} 
          icon={<Users size={20} />} 
          subtitle="Carritos no pagados"
          trend={data.kpis.abandonmentRate > 40 ? 'down' : 'up'}
          reverseTrend
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 nd-card !p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">Tendencia de Ventas</h3>
            <span className="text-[var(--accent)] text-[10px] uppercase font-body font-bold tracking-widest flex items-center gap-1">
              <Zap size={12} /> Live
            </span>
          </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={mounted && window.innerWidth < 1440 ? 240 : 300}>
                <LineChart data={data.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-disabled)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--text-disabled)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `$${val/1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={ACCENT_COLOR} 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: ACCENT_COLOR, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: 'var(--black)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-disabled)] text-xs uppercase tracking-widest">
                Cargando gráfico...
              </div>
            )}

          </div>

        {/* Status Distribution */}
        <div className="nd-card !p-6 flex flex-col gap-4">
          <h3 className="font-display text-lg">Estados de Órdenes</h3>
          <div className="h-[250px] w-full relative">
            {mounted ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltipPie />} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '10px', textTransform: 'capitalize' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-disabled)] text-xs uppercase tracking-widest">
                Cargando gráfico...
              </div>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-[var(--border)]">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
              <span>Eficiencia de Pago</span>
              <span className="text-[var(--text-primary)] font-bold">
                {((data.kpis.approvedOrders / (data.kpis.totalOrders || 1)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-1 bg-[var(--surface-raised)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent)] transition-all duration-1000" 
                style={{ width: `${(data.kpis.approvedOrders / (data.kpis.totalOrders || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="nd-card !p-6">
          <h3 className="font-display text-lg mb-6">Top 10 Productos</h3>
          <div className="space-y-4">
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-display text-[var(--accent)] w-4 opacity-50">#{i+1}</span>
                  <div>
                    <h4 className="text-sm font-body font-medium group-hover:text-[var(--accent)] transition-colors">{p.nombre}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">{p.marca}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-body font-bold text-[var(--text-primary)]">{formatCurrency(p.revenue)}</span>
                  <p className="text-[10px] text-[var(--accent)] uppercase font-bold">{p.vendidos} ud.</p>
                </div>
              </div>
            ))}
            {data.topProducts.length === 0 && <p className="text-center py-8 text-[var(--text-disabled)] italic">No hay ventas en este periodo</p>}
          </div>
        </div>

        {/* Depletion Alerts (Botella Madre) */}
        <div className="nd-card !p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={20} className="text-[var(--accent)]" />
            <h3 className="font-display text-lg">Alertas de Reposición</h3>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2">
            {data.depletionAlerts.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-body font-medium">{p.nombre}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase">{p.marca}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${p.percentage > 90 ? 'text-[#D71921]' : 'text-[var(--accent)]'}`}>
                    {p.percentage.toFixed(0)}% Agotado
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${p.percentage > 90 ? 'bg-[#D71921]' : 'bg-[var(--accent)]'}`}
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] uppercase tracking-widest text-[var(--text-disabled)]">
                  <span>Vendidos: {p.mlVendidos}ml</span>
                  <span>Botella: {p.mlTotales}ml</span>
                </div>
              </div>
            ))}
            {data.depletionAlerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--text-disabled)]">
                <Package size={32} className="mb-2 opacity-20" />
                <p className="text-xs">Sin alertas. Cargá la capacidad de las "Botellas Madre" en los productos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, subtitle, trend, reverseTrend }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  reverseTrend?: boolean;
}) {
  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-[var(--text-secondary)]';
    if (reverseTrend) {
      return trend === 'up' ? 'text-[var(--success)]' : 'text-[#D71921]';
    }
    return trend === 'up' ? 'text-[var(--success)]' : 'text-[#D71921]';
  };

  return (
    <div className="nd-card !p-5 relative overflow-hidden group hover:border-[var(--accent)] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[var(--surface-raised)] rounded border border-[var(--border)] text-[var(--accent)]">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${getTrendColor()}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <TrendingUp size={12} className="rotate-180" />}
            {trend === 'up' ? 'OK' : 'ALTA'}
          </div>
        )}
      </div>
      <h3 className="text-[var(--text-secondary)] text-[10px] uppercase font-body font-medium tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-2xl font-display text-[var(--text-display)] mb-1">{value}</p>
      <p className="text-[var(--text-disabled)] text-[10px] font-body">{subtitle}</p>
      <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        {icon}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded shadow-xl">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">{label}</p>
        <p className="text-sm font-display text-[var(--accent)]">
          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(payload[0].value!)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-2 rounded shadow-xl">
        <p className="text-[10px] uppercase tracking-widest text-[var(--accent)]">
          {payload[0].name}: <span className="text-[var(--text-primary)]">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};
