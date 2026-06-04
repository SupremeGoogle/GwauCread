import { NextRequest, NextResponse } from "next/server";
import type { Lead } from "@/lib/types";

export async function POST(request: NextRequest) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json({ error: "Google Sheets пока не подключен" }, { status: 503 });
  }

  const lead = (await request.json()) as Lead;
  if (!lead.name || !lead.phone) {
    return NextResponse.json({ error: "Укажите имя и контакт" }, { status: 400 });
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "create", lead })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Google Sheets не принял заявку" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
