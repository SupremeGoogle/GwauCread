import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lead } from "@/lib/types";

const leadsFile = path.join(process.cwd(), "data", "submissions.json");

async function saveLead(lead: Lead) {
  let leads: Lead[] = [];
  try {
    const text = await fs.readFile(leadsFile, "utf-8");
    leads = JSON.parse(text);
  } catch {
    // first time
  }
  leads.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...lead });
  if (leads.length > 200) leads.length = 200;
  try {
    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2), "utf-8");
  } catch {
    // read-only fs (Vercel) — ignore
  }
}

export async function POST(request: NextRequest) {
  try {
    const lead = (await request.json()) as Lead;
    if (!lead.name || !lead.phone) {
      return NextResponse.json({ error: "Укажите имя и контакт" }, { status: 400 });
    }

    // Always save locally (best-effort)
    await saveLead(lead);

    // Try Google Sheets in background (non-blocking)
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      fetch(scriptUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", lead }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
