import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { getLocalLeads } from "@/lib/leads";

export async function GET(request: NextRequest) {
  try {
    const auth = assertAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const sheetUrl = process.env.GOOGLE_SHEETS_URL || "";
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (scriptUrl) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const url = new URL(scriptUrl);
        url.searchParams.set("action", "list");
        const response = await fetch(url.toString(), {
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ ...data, sheetUrl });
        }
      } catch {
        // Fallback to local
      }
    }

    const localLeads = await getLocalLeads();
    return NextResponse.json({
      leads: localLeads,
      sheetUrl,
      warning: "Показаны локальные заявки (Google Sheets недоступен)",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
