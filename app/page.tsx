// app/page.tsx
"use client";
import { useState } from "react";

export default function Page() {
  // Units
  const [pressureUnit, setPressureUnit] = useState<"psi" | "bar">("psi");
  const [flowUnit, setFlowUnit] = useState<"lpm" | "gpm">("lpm");

  // Inputs as strings so they can be blank initially
  const [pressure, setPressure] = useState<string>(""); // blank by default
  const [flow, setFlow] = useState<string>("");         // blank by default

  // UI state
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation / parsing
  const pressureNum = Number(pressure);
  const flowNum = Number(flow);
  const inputsReady =
    pressure.trim() !== "" &&
    flow.trim() !== "" &&
    !Number.isNaN(pressureNum) &&
    !Number.isNaN(flowNum) &&
    pressureNum > 0 &&
    flowNum > 0;

  async function calc() {
    if (!inputsReady) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/calc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pressure: pressureNum,     // send numbers
          pressureUnit,
          flow: flowNum,             // send numbers
          flowUnit
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Calculation failed");
      setResult(j);
    } catch (e: any) {
      setError(e.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Suttner Injector Sizing Guide</h1>
      <p style={{ color: "#555", marginTop: 8 }}>
        Enter pressure & flow. We match the nearest TIP SIZE and return Injector / Diffuser / Air from your chart.
      </p>

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12, marginTop: 16 }}>
        <label>
          <div style={{ fontSize: 12, color: "#555" }}>Pressure</div>
          <input
            type="number"
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            placeholder="e.g. 1600"
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, width: "100%" }}
          />
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#555" }}>Unit</div>
          <select
            value={pressureUnit}
            onChange={(e) => setPressureUnit(e.target.value as any)}
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, width: "100%" }}
          >
            <option value="psi">PSI</option>
            <option value="bar">BAR</option> {/* label capitalised, value stays "bar" */}
          </select>
        </label>

        <label>
          <div style={{ fontSize: 12, color: "#555" }}>Flow</div>
          <input
            type="number"
            step="0.1"
            value={flow}
            onChange={(e) => setFlow(e.target.value)}
            placeholder="e.g. 12"
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, width: "100%" }}
          />
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#555" }}>Unit</div>
          <select
            value={flowUnit}
            onChange={(e) => setFlowUnit(e.target.value as any)}
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, width: "100%" }}
          >
            <option value="lpm">LPM</option>
            <option value="gpm">GPM</option>
          </select>
        </label>
      </div>

      {/* Calculate */}
      <button
        onClick={calc}
        disabled={loading || !inputsReady}
        style={{
          marginTop: 16,
          padding: "10px 14px",
          background: "#111",
          color: "#fff",
          borderRadius: 10,
          border: "none",
          opacity: loading || !inputsReady ? 0.6 : 1,
          cursor: loading || !inputsReady ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>
      {!inputsReady && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
          Enter both Pressure and Flow to enable Calculate.
        </div>
      )}

      {/* Errors */}
      {error && <div style={{ marginTop: 16, color: "#b00020" }}>{error}</div>}

      {/* Results */}
      {result && !error && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Nozzle number (N)</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{result.nozzleNumber}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Matched Tip</div>
              <div style={{ fontWeight: 600 }}>{result.matched.tipSize}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Injector</div>
              <div style={{ fontWeight: 600 }}>{result.matched.injectorSize}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Diffuser</div>
              <div style={{ fontWeight: 600 }}>{result.matched.diffuserSize}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Air Nozzle</div>
              <div style={{ fontWeight: 600 }}>{result.matched.airNozzleSize}</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 12, color: "#777" }}>
        Guidance only. Verify in the field with a gauge & cylinder test.
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: "#666" }}>
        Created by{" "}
        <a
          href="https://www.chiefsaustralia.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline" }}
        >
          Chiefs Australia
        </a>
      </div>
    </main>
  );
}
