import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { commitFiles } from "@/lib/github";
import type { Product } from "@/lib/types";

export async function POST(request: NextRequest) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const products = (await request.json()) as Product[];
  if (!Array.isArray(products)) {
    return NextResponse.json({ error: "Некорректный список товаров" }, { status: 400 });
  }

  for (const product of products) {
    if (!product.id || !product.name || !product.image || !product.description) {
      return NextResponse.json({ error: "У каждого товара должны быть id, name, image и description" }, { status: 400 });
    }
  }

  const sha = await commitFiles(
    [
      {
        path: "data/products.json",
        content: `${JSON.stringify(products, null, 2)}\n`
      }
    ],
    "Update products from admin panel"
  );

  return NextResponse.json({ ok: true, sha });
}
