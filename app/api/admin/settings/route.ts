import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";

export async function GET(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  return NextResponse.json(await getSettings());
}

export async function POST(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const settings = await request.json();
  await saveSettings(settings);
  return NextResponse.json({ ok: true });
}
