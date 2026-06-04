"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, LogIn, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import type { Lead, Product } from "@/lib/types";

const emptyProduct: Product = {
  id: "",
  name: "",
  category: "Конструктор",
  price: "",
  oldPrice: "",
  badge: "",
  rating: "",
  reviews: "",
  image: "",
  buyUrl: "",
  description: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const authHeaders = useMemo(() => ({ "x-admin-password": password }), [password]);

  useEffect(() => {
    const savedPassword = window.localStorage.getItem("gwau-admin-password");
    if (savedPassword) {
      setPassword(savedPassword);
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    loadProducts();
    loadLeads();
  }, [authorized]);

  async function loadProducts() {
    const response = await fetch("/api/products", { cache: "no-store" });
    const data = (await response.json()) as Product[];
    setProducts(data);
  }

  async function loadLeads() {
    setLeadStatus("Загружаем заявки");
    const response = await fetch("/api/admin/leads", { headers: authHeaders, cache: "no-store" });
    const data = await response.json();
    if (response.ok) {
      setLeads(data.leads || []);
      setLeadStatus(data.warning || "");
    } else {
      setLeadStatus(data.error || "Не удалось загрузить заявки");
    }
  }

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("gwau-admin-password", password);
    setAuthorized(true);
  }

  function edit(product: Product) {
    setEditingId(product.id);
    setDraft(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setDraft(emptyProduct);
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = draft.id || slugify(draft.name) || crypto.randomUUID();
    const nextProduct = { ...draft, id };

    setProducts((current) => {
      if (editingId) {
        return current.map((product) => (product.id === editingId ? nextProduct : product));
      }
      return [nextProduct, ...current];
    });
    resetForm();
    setStatus("Товар подготовлен. Нажмите «Сохранить в GitHub».");
  }

  function removeProduct(id: string) {
    setProducts((current) => current.filter((product) => product.id !== id));
    setStatus("Товар удалён из черновика. Нажмите «Сохранить в GitHub».");
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.set("file", file);
    setStatus("Загружаем картинку в GitHub");
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: authHeaders,
      body: form
    });
    const data = await response.json();
    if (response.ok) {
      setDraft((current) => ({ ...current, image: data.url }));
      setStatus("Картинка загружена. Теперь сохраните товар.");
    } else {
      setStatus(data.error || "Не удалось загрузить картинку");
    }
  }

  async function persistProducts() {
    setSaving(true);
    setStatus("Сохраняем товары в GitHub");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { ...authHeaders, "content-type": "application/json" },
      body: JSON.stringify(products)
    });
    const data = await response.json();
    setSaving(false);

    if (response.ok) {
      setStatus(`Сохранено в GitHub. Commit: ${String(data.sha).slice(0, 7)}`);
    } else {
      setStatus(data.error || "Не удалось сохранить товары");
    }
  }

  if (!authorized) {
    return (
      <main className="admin-page">
        <div className="admin-shell" style={{ maxWidth: 460 }}>
          <form className="panel form" onSubmit={login}>
            <Link className="brand" href="/">
              <span className="brand-mark">GC</span>
              <span>GwauCread</span>
            </Link>
            <h2>Вход в админку</h2>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
              required
            />
            <button className="button primary" type="submit">
              <LogIn size={18} /> Войти
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="brand" href="/">
            <span className="brand-mark">GC</span>
            <span>GwauCread Admin</span>
          </Link>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="button secondary" onClick={loadLeads} type="button">
              <RefreshCw size={18} /> Обновить заявки
            </button>
            <button className="button primary" disabled={saving} onClick={persistProducts} type="button">
              <Save size={18} /> {saving ? "Сохраняем" : "Сохранить в GitHub"}
            </button>
          </div>
        </header>

        <div className="admin-grid">
          <section className="panel">
            <h2>{editingId ? "Редактировать товар" : "Добавить товар"}</h2>
            <form className="form" onSubmit={saveDraft}>
              <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Название" required />
              <input className="input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Категория" />
              <input className="input" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Цена" />
              <input className="input" value={draft.oldPrice || ""} onChange={(e) => setDraft({ ...draft, oldPrice: e.target.value })} placeholder="Старая цена" />
              <input className="input" value={draft.badge || ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} placeholder="Бейдж" />
              <input className="input" value={draft.rating || ""} onChange={(e) => setDraft({ ...draft, rating: e.target.value })} placeholder="Рейтинг" />
              <input className="input" value={draft.reviews || ""} onChange={(e) => setDraft({ ...draft, reviews: e.target.value })} placeholder="Отзывы / доставка" />
              <textarea className="textarea" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Описание" required />
              <input className="input" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="URL картинки" required />
              <input className="input" value={draft.buyUrl || ""} onChange={(e) => setDraft({ ...draft, buyUrl: e.target.value })} placeholder="Ссылка покупки" />
              <label className="button secondary" style={{ justifyContent: "center" }}>
                <ImagePlus size={18} /> Загрузить картинку
                <input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
              <button className="button primary" type="submit">
                <Plus size={18} /> {editingId ? "Обновить товар" : "Добавить товар"}
              </button>
              {editingId ? (
                <button className="button secondary" type="button" onClick={resetForm}>
                  Отменить
                </button>
              ) : null}
              <div className="status">{status}</div>
            </form>
          </section>

          <section className="panel">
            <h2>Товары</h2>
            <div className="admin-list">
              {products.map((product) => (
                <article className="admin-product" key={product.id}>
                  <img src={product.image} width={86} height={86} alt={product.name} />
                  <button style={{ textAlign: "left", background: "transparent", border: 0, cursor: "pointer" }} onClick={() => edit(product)} type="button">
                    <strong>{product.name}</strong>
                    <div className="muted">{product.price} · {product.category}</div>
                  </button>
                  <button className="icon-button" title="Удалить" onClick={() => removeProduct(product.id)} type="button">
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>

            <div style={{ height: 28 }} />
            <h2>Заявки</h2>
            <div className="status">{leadStatus}</div>
            {leads.length === 0 ? (
              <p className="muted">Заявок пока нет.</p>
            ) : (
              leads.map((lead) => (
                <div className="lead-row" key={lead.id || `${lead.createdAt}-${lead.phone}`}>
                  <strong>{lead.name}</strong>
                  <div>{lead.phone}</div>
                  <div className="muted">{lead.product}</div>
                  <p>{lead.message}</p>
                  <small className="muted">{lead.createdAt}</small>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
