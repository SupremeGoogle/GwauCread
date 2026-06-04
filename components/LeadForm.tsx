"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Product } from "@/lib/types";

export function LeadForm({ products }: { products: Product[] }) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    delete body.consent;
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    setPending(false);
    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      event.currentTarget.reset();
      const msg = result.warning ? result.warning : "Заявка отправлена. Мы скоро свяжемся с вами.";
      setStatus(msg);
    } else {
      setStatus(result.error || "Не удалось отправить заявку.");
    }
  }

  return (
    <form className="form" onSubmit={submit}>
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
        {pending ? "Отправляем" : "Отправить заявку"}
      </button>
      <div className="status">{status}</div>
    </form>
  );
}
