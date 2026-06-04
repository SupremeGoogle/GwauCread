import { NextRequest } from "next/server";

export function assertAdmin(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");

  if (!expected) {
    return { ok: false, status: 500, message: "ADMIN_PASSWORD is not configured" };
  }

  if (!provided || provided !== expected) {
    return { ok: false, status: 401, message: "Неверный пароль админки" };
  }

  return { ok: true, status: 200, message: "OK" };
}
