import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, product, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Укажите имя и контакт" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ error: "Google Sheets не подключён" }, { status: 503 });
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "create",
        lead: { name, phone, product: product || "", message: message || "" },
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json({ error: "Google Sheets ответил ошибкой: " + text }, { status: 502 });
    }

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = {}; }

    if (parsed.error) {
      return NextResponse.json({ error: "Google Sheets: " + parsed.error }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Ошибка отправки: " + message }, { status: 500 });
  }
}
