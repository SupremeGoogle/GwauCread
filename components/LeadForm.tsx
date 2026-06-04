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
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });

    setPending(false);
    if (response.ok) {
      event.currentTarget.reset();
      setStatus("Заявка отправлена. Мы скоро свяжемся с вами.");
    } else {
      const data = await response.json().catch(() => ({}));
      setStatus(data.error || "Не удалось отправить заявку.");
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
      <button className="button primary" type="submit" disabled={pending}>
        <Send size={18} />
        {pending ? "Отправляем" : "Отправить заявку"}
      </button>
      <div className="status">{status}</div>
    </form>
  );
}
