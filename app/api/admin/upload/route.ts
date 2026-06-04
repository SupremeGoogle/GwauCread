import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { commitFiles } from "@/lib/github";

function safeName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "webp";
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`.replace(/[^a-z0-9.-]/gi, "");
}

export async function POST(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Можно загружать только изображения" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = safeName(file.name);
  const repoPath = `public/uploads/${fileName}`;

  const sha = await commitFiles(
    [
      {
        path: repoPath,
        content: bytes.toString("base64"),
        encoding: "base64"
      }
    ],
    "Upload product image from admin panel"
  );

  return NextResponse.json({ ok: true, sha, url: `/uploads/${fileName}` });
}
