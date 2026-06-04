import { NextRequest, NextResponse } from "next/server";
import type { Lead } from "@/lib/types";
import { saveLocalLead } from "@/lib/leads";

export async function POST(request: NextRequest) {
  const lead = (await request.json()) as Lead;
  if (!lead.name || !lead.phone) {
    return NextResponse.json({ error: "Укажите имя и контакт" }, { status: 400 });
  }

  await saveLocalLead(lead);

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", lead }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      // Google Sheets is optional — local save is authoritative
    }
  }

  return NextResponse.json({ ok: true });
}
