import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ leads: [], warning: "GOOGLE_SCRIPT_URL не задан" });
  }

  try {
    const url = new URL(scriptUrl);
    url.searchParams.set("action", "list");
    const res = await fetch(url.toString());
    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json({ leads: [], warning: "Google Sheets ответил ошибкой: " + text });
    }

    let data;
    try { data = JSON.parse(text); } catch { data = {}; }

    if (data.error) {
      return NextResponse.json({ leads: [], warning: "Google Sheets: " + data.error });
    }

    return NextResponse.json({ leads: data.leads || [], sheetUrl: process.env.GOOGLE_SHEETS_URL || "" });
  } catch (e) {
    return NextResponse.json({ leads: [], warning: "Google Sheets недоступен: " + (e instanceof Error ? e.message : "таймаут") });
  }
}
