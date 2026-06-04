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
    const scriptSecret = process.env.GOOGLE_SCRIPT_SECRET;

    let fromRemote = false;

    if (scriptUrl) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const url = new URL(scriptUrl);
        url.searchParams.set("action", "list");
        url.searchParams.set("secret", scriptSecret || "");
        const response = await fetch(url.toString(), {
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timer);

        const text = await response.text();

        if (response.ok) {
          const data = JSON.parse(text);
          if (data.leads) {
            fromRemote = true;
            return NextResponse.json({ ...data, sheetUrl });
          }
          return NextResponse.json({ leads: [], sheetUrl, warning: "Google Sheets ответил: " + (data.error || text) });
        }

        return NextResponse.json({ leads: [], sheetUrl, warning: "Google Sheets ответил ошибкой: " + text });
      } catch (e) {
        if (!fromRemote) {
          const localLeads = await getLocalLeads();
          return NextResponse.json({
            leads: localLeads,
            sheetUrl,
            warning: "Google Sheets недоступен (" + (e instanceof Error ? e.message : "таймаут") + "), показаны локальные заявки",
          });
        }
      }
    }

    const localLeads = await getLocalLeads();
    return NextResponse.json({
      leads: localLeads,
      sheetUrl,
      warning: "Google Sheets не подключён, показаны локальные заявки",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
