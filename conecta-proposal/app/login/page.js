"use client";
import { useState } from "react";

export default function LoginPage() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo })
      });
      if (r.ok) {
        window.location.href = "/";
        return;
      }
      const d = await r.json().catch(() => ({}));
      setError(d.error || "No se pudo entrar.");
    } catch (e) {
      setError("No se pudo conectar con el servidor.");
    }
    setCargando(false);
  }

  return (
    <main style={styles.main}>
      <form onSubmit={onSubmit} style={styles.card}>
        <div style={styles.brand}>CONECTA</div>
        <div style={styles.tagline}>Proposal</div>
        <label style={styles.label} htmlFor="codigo">Código de acceso</label>
        <input
          id="codigo"
          type="password"
          autoFocus
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" disabled={cargando} style={styles.button}>
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

const styles = {
  main: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7FA", fontFamily: '"Segoe UI",Inter,system-ui,-apple-system,Helvetica,Arial,sans-serif' },
  card: { background: "#fff", border: "1px solid #DFE6ED", borderRadius: 10, padding: 32, width: 320, boxShadow: "0 8px 24px rgba(14,36,58,.08)" },
  brand: { fontWeight: 700, letterSpacing: ".16em", color: "#0E243A", fontSize: 18 },
  tagline: { color: "#00AEEF", fontSize: 13, letterSpacing: ".1em", marginBottom: 22 },
  label: { display: "block", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", color: "#5B6B7C", marginBottom: 6 },
  input: { width: "100%", boxSizing: "border-box", padding: "9px 11px", border: "1px solid #DFE6ED", borderRadius: 8, marginBottom: 14, fontSize: 14 },
  error: { color: "#b0342c", fontSize: 13, marginBottom: 12 },
  button: { width: "100%", background: "#0E243A", color: "#fff", border: 0, borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer", fontSize: 14 }
};
