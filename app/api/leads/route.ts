import { NextRequest, NextResponse } from "next/server";
import type { Lead } from "@/lib/types";
import { saveLocalLead } from "@/lib/leads";

export async function POST(request: NextRequest) {
  try {
    const lead = (await request.json()) as Lead;
    if (!lead.name || !lead.phone) {
      return NextResponse.json({ error: "Укажите имя и контакт" }, { status: 400 });
    }

    await saveLocalLead(lead);

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const scriptSecret = process.env.GOOGLE_SCRIPT_SECRET;

    let sheetResponse: string | null = null;

    if (scriptUrl) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(scriptUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "create", secret: scriptSecret, lead }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        sheetResponse = await res.text();
        if (!res.ok) {
          return NextResponse.json({ ok: true, warning: "Заявка сохранена локально, но Google Sheets ответил ошибкой: " + sheetResponse });
        }
      } catch (e) {
        return NextResponse.json({ ok: true, warning: "Заявка сохранена локально, Google Sheets недоступен: " + (e instanceof Error ? e.message : "таймаут") });
      }
    }

    return NextResponse.json({ ok: true, warning: sheetResponse ? null : "Google Sheets не подключён, заявка сохранена локально" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
