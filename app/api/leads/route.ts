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
    if (scriptUrl) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "create", lead }),
          signal: controller.signal,
        });
        clearTimeout(timer);
      } catch {
        // Google Sheets is optional
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
