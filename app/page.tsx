"use client";
import { useState } from "react";

export default function Page() {
  const [pressure, setPressure] = useState(1600);
  const [pressureUnit, setPressureUnit] = useState<"psi"|"bar">("psi");
  const [flow, setFlow] = useState(12);
  const [flowUnit, setFlowUnit] = useState<"lpm"|"gpm">("lpm");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function calc() {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/calc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pressure, pressureUnit, flow, flowUnit })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Calculation failed");
      setResult(j);
    } catch (e:any) {
      setError(e.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

   return (
    <main style={{maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif"}}>
     <h1 style={{fontSize: 24, fontWeight: 700}}>Suttner Injector Sizing Guide</h1>
      <p style={{color:"#555", marginTop:8}}>
        Enter the pressure & flow from your pressure washer. We match the nearest tip size and supply the Injector / Diffuser and Air Nozzle sizes.
      </p>


      <div style={{display:"grid", gridTemplateColumns:"1fr 120px", gap:12, marginTop:16}}>
        <label>
          <div style={{fontSize:12, color:"#555"}}>Pressure</div>
          <input type="number" value={pressure} onChange={e=>setPressure(+e.target.value)}
            style={{padding:"8px 10px", border:"1px solid #ccc", borderRadius:8, width:"100%"}}/>
        </label>
        <label>
          <div style={{fontSize:12, color:"#555"}}>Unit</div>
          <select value={pressureUnit} onChange={e=>setPressureUnit(e.target.value as any)}
            style={{padding:"8px 10px", border:"1px solid #ccc", borderRadius:8, width:"100%"}}>
            <option value="psi">PSI</option>
            <option value="bar">BAR</option>
          </select>
        </label>

        <label>
          <div style={{fontSize:12, color:"#555"}}>Flow</div>
          <input type="number" step="0.1" value={flow} onChange={e=>setFlow(+e.target.value)}
            style={{padding:"8px 10px", border:"1px solid #ccc", borderRadius:8, width:"100%"}}/>
        </label>
        <label>
          <div style={{fontSize:12, color:"#555"}}>Unit</div>
          <select value={flowUnit} onChange={e=>setFlowUnit(e.target.value as any)}
            style={{padding:"8px 10px", border:"1px solid #ccc", borderRadius:8, width:"100%"}}>
            <option value="lpm">LPM</option>
            <option value="gpm">GPM</option>
          </select>
        </label>
      </div>

      <button onClick={calc} disabled={loading}
        style={{marginTop:16, padding:"10px 14px", background:"#111", color:"#fff", borderRadius:10, border:"none"}}>
        {loading? "Calculating..." : "Calculate"}
      </button>

      {error && <div style={{marginTop:16, color:"#b00020"}}>{error}</div>}

      {result && !error && (
        <div style={{marginTop:24, padding:16, border:"1px solid #eee", borderRadius:12}}>
          <div style={{fontSize:12, color:"#666"}}>Nozzle number (N)</div>
          <div style={{fontSize:22, fontWeight:700}}>{result.nozzleNumber}</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginTop:12}}>
            <div><div style={{fontSize:12, color:"#666"}}>Matched Tip</div><div style={{fontWeight:600}}>{result.matched.tipSize}</div></div>
            <div><div style={{fontSize:12, color:"#666"}}>Injector</div><div style={{fontWeight:600}}>{result.matched.injectorSize}</div></div>
            <div><div style={{fontSize:12, color:"#666"}}>Diffuser</div><div style={{fontWeight:600}}>{result.matched.diffuserSize}</div></div>
            <div><div style={{fontSize:12, color:"#666"}}>Air Nozzle</div><div style={{fontWeight:600}}>{result.matched.airNozzleSize}</div></div>
          </div>
        </div>
      )}

      <div style={{marginTop:24, fontSize:12, color:"#777"}}>
       Note: This guide is provided as a reference only. Please ensure your pressure washer’s pressure and flow are correct, otherwise the recommended settings may not perform as expected.
      </div>
    </main>
  );
}
