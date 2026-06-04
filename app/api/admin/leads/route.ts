import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;

  if (!scriptUrl || !secret) {
    return NextResponse.json({ leads: [], warning: "Google Sheets пока не подключен" });
  }

  const url = new URL(scriptUrl);
  url.searchParams.set("action", "list");
  url.searchParams.set("secret", secret);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ error: "Не удалось получить заявки" }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
