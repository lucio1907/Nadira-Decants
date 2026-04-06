"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./actions";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        router.push("/admin/productos");
        router.refresh();
      } else {
        setError(res.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--black)]">
      <div className="nd-card w-full max-w-md">
        <h1 className="text-display-md text-center mb-6">Nadira Admin</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="nd-input w-full bg-[var(--surface-raised)] border-0 focus:ring-1 focus:ring-[var(--accent)]"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="nd-input w-full bg-[var(--surface-raised)] border-0 focus:ring-1 focus:ring-[var(--accent)]"
              required
            />
          </div>
          {error && <p className="text-[#D71921] text-sm text-center font-medium bg-[#D71921]/10 py-2 rounded-md">{error}</p>}
          <button 
            type="submit" 
            className="nd-btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
