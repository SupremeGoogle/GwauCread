import Link from "next/link";
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Star } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { getProducts } from "@/lib/products";

export default async function OriginalHomePage() {
  const products = await getProducts();

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">
          <span className="brand-mark">GC</span>
          <span>GwauCread</span>
        </Link>
        <div className="nav-links">
          <a href="#catalog">Каталог</a>
          <a href="#contact">Заявка</a>
          <Link href="/privacy">Политика</Link>
          <Link href="/admin">Админка</Link>
        </div>
      </nav>

      <section className="hero" style={{ backgroundImage: "url('/gwaucread-hero.png')" }}>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Творческие наборы и коллекционные сборки</p>
          <h1>GwauCread</h1>
          <p className="lead">
            Предметы для спокойной сборки, ярких подарков и полок, которые хочется рассматривать.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#catalog">
              Смотреть товары <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#contact">
              Оставить заявку
            </a>
          </div>
        </div>
        <div className="hero-panel">
          <span>6 товаров</span>
          <strong>Конструкторы, рукоделие, коллекционный вайб</strong>
        </div>
      </section>

      <section className="section" id="catalog">
        <div className="section-head">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2>Товары GwauCread</h2>
          </div>
          <p className="muted">Ассортимент можно менять через админ-панель.</p>
        </div>

        <div className="products">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-media">
                {product.badge ? <span className="badge">{product.badge}</span> : null}
                <img src={product.image} width={516} height={688} alt={product.name} />
              </div>
              <div className="product-body">
                <div className="price-row">
                  <span className="price">{product.price}</span>
                  {product.oldPrice ? <span className="old-price">{product.oldPrice}</span> : null}
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="meta">
                  <Star size={16} fill="currentColor" />
                  <span>{product.rating || "Новый товар"}</span>
                  <span>{product.reviews}</span>
                </div>
                <div className="product-actions">
                  <a className="buy-button" href={product.buyUrl || "#contact"} target={product.buyUrl ? "_blank" : undefined} rel="noreferrer">
                    <ShoppingBag size={18} />
                    Купить
                  </a>
                  <a className="details-link" href="#contact">
                    Задать вопрос
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-band" id="contact">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">Связаться</p>
            <h2>Оставьте заявку</h2>
            <p>
              Форма пока простая: имя, контакт, товар и комментарий. После подключения Google Sheets заявки появятся в админке.
            </p>
            <p style={{ marginTop: 18 }}>
              <ShieldCheck size={18} /> Данные используются только для связи по заявке.
            </p>
          </div>
          <LeadForm products={products} />
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} GwauCread</span>
        <span>
          <Sparkles size={16} /> Современный каталог для Vercel
        </span>
      </footer>
    </main>
  );
}
