"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Package2, Settings, Menu, X, ShoppingCart, ExternalLink, BarChart3, Ticket } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { logoutAdmin } from "@/app/admin/login/actions";
import { useRouter } from "next/navigation";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 200);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 200);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const navigate = (href: string) => {
    setIsMobileMenuOpen(false);
    startTransition(() => {
      router.push(href);
    });
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };
  const navItems = [
    { name: "Estadísticas", href: "/admin/estadisticas", icon: BarChart3 },
    { name: "Productos", href: "/admin/productos", icon: Package2 },
    { name: "Ordenes", href: "/admin/ordenes", icon: ShoppingCart },
    { name: "Cupones", href: "/admin/cupones", icon: Ticket },
    // { name: "Ajustes", href: "/admin/ajustes", icon: Settings },
  ];


  return (
    <div className="min-h-screen bg-[var(--black)] flex flex-col md:flex-row">
      {/* Top Progress Bar */}
      {isPending && (
        <div
          className="nd-progress-bar"
          style={{
            width: `${progress}%`,
            transition: 'width 0.4s ease-out'
          }}
        />
      )}

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <span className="text-heading font-display">Nadira Admin</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} 
        md:fixed md:inset-y-0 md:left-0 md:z-10 md:flex flex-col w-full md:w-64 border-r border-[var(--border)] bg-[var(--surface)]
      `}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <Link href="/admin/productos" className="text-heading font-display">Nadira Admin</Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.href)}
                    className={`
                      flex items-center gap-3 px-6 py-3 transition-colors w-full text-left
                      ${isActive
                        ? "text-[var(--text-display)] border-r-2 border-[var(--accent)] bg-[var(--surface-raised)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.02)]"
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span className="font-body text-sm uppercase tracking-widest">{item.name}</span>
                  </button>

                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--border)] flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-2 py-3 w-full text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <ExternalLink size={20} className="group-hover:text-[var(--accent)] transition-colors" />
            <span className="font-body text-xs uppercase tracking-widest">Ir a la web</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-3 w-full text-left text-[var(--text-secondary)] hover:text-[#D71921] transition-colors group"
          >
            <LogOut size={20} />
            <span className="font-body text-xs uppercase tracking-widest">Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 md:ml-64 p-4 md:p-8 min-w-0 bg-[var(--black)] transition-opacity duration-500 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
        {children}
      </main>

  </div>
  );
}
