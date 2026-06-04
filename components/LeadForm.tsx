"use client";

import { Send } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import type { Product } from "@/lib/types";

export function LeadForm({ products }: { products: Product[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");

    try {
      const form = new FormData(event.currentTarget);
      const body = Object.fromEntries(form.entries());
      delete body.consent;

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        formRef.current?.reset();
        setStatus(result.warning ? "✓ " + result.warning : "✓ Заявка отправлена!");
      } else {
        setStatus("✗ " + (result.error || "Ошибка сервера"));
      }
    } catch {
      setStatus("✗ Ошибка соединения");
    }

    setPending(false);
  }

  return (
    <form className="form" ref={formRef} onSubmit={submit}>
      <input className="input" name="name" placeholder="Имя" required />
      <input className="input" name="phone" placeholder="Телефон или Telegram" required />
      <select className="select" name="product" defaultValue="">
        <option value="">Интересующий товар</option>
        {products.map((product) => (
          <option key={product.id} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>
      <textarea className="textarea" name="message" placeholder="Комментарий" />
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Согласен(на) на{" "}
          <a href="/privacy" target="_blank" className="consent-link">
            обработку персональных данных
          </a>
        </span>
      </label>
      <button className="button primary" type="submit" disabled={pending}>
        <Send size={18} />
        {pending ? "Отправляем…" : "Отправить заявку"}
      </button>
      {status && <div className="status" style={{ marginTop: 8 }}>{status}</div>}
    </form>
  );
}
