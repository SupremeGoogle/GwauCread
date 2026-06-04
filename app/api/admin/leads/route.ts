import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { getLocalLeads } from "@/lib/leads";

export async function GET(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const sheetUrl = process.env.GOOGLE_SHEETS_URL || "";
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (scriptUrl) {
    try {
      const url = new URL(scriptUrl);
      url.searchParams.set("action", "list");
      const response = await fetch(url.toString(), {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ ...data, sheetUrl });
      }
    } catch {
      // Fallback to local
    }
  }

  const localLeads = await getLocalLeads();
  return NextResponse.json({ leads: localLeads, sheetUrl, warning: "Показаны локальные заявки (Google Sheets недоступен)" });
}
