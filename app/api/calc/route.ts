import { NextRequest, NextResponse } from "next/server";
import { toPSI, toLPM } from "@/lib/units";
import { nozzleNumberFromPsiLpm, pickNearestTip } from "@/lib/nozzle";
import chart from "@/data/tip_chart.json";

type Row = { tip_size:number, injector_size:number, diffuser_size:number, air_nozzle_size:number };

export async function POST(req: NextRequest) {
  try {
    const { pressure, pressureUnit="psi", flow, flowUnit="lpm" } = await req.json();
    const psi = toPSI(Number(pressure), pressureUnit);
    const lpm = toLPM(Number(flow), flowUnit);
    const N = nozzleNumberFromPsiLpm(psi, lpm);

    const tips = (chart as Row[]).map(r => r.tip_size);
    const matched = pickNearestTip(N, tips);
    const row = (chart as Row[]).find(r => r.tip_size === matched);
    if (!row) throw new Error("Matched tip not found in chart");

    return NextResponse.json({
      inputs: { pressure: Number(pressure), pressureUnit, flow: Number(flow), flowUnit },
      nozzleNumber: Number(N.toFixed(2)),
      matched: {
        tipSize: matched,
        injectorSize: row.injector_size,
        diffuserSize: row.diffuser_size,
        airNozzleSize: row.air_nozzle_size
      }
    });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
