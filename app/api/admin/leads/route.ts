import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { assertAdmin } from "@/lib/auth";
import type { Lead } from "@/lib/types";

const leadsFile = path.join(process.cwd(), "data", "submissions.json");

async function readLocalLeads(): Promise<Lead[]> {
  try {
    const text = await fs.readFile(leadsFile, "utf-8");
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const sheetUrl = process.env.GOOGLE_SHEETS_URL || "";
  const localLeads = await readLocalLeads();

  // Try remote, fall back to local
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 4000);
      const url = new URL(scriptUrl);
      url.searchParams.set("action", "list");
      const response = await fetch(url.toString(), { signal: controller.signal });
      if (response.ok) {
        const data = await response.json();
        if (data.leads) {
          return NextResponse.json({ leads: data.leads, sheetUrl, fromRemote: true });
        }
      }
    } catch {
      // fallback
    }
  }

  return NextResponse.json({
    leads: localLeads,
    sheetUrl,
    warning: localLeads.length > 0 ? "Локальные заявки (Google Sheets недоступен)" : "",
  });
}
