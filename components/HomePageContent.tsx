"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Star, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { LeadForm } from "@/components/LeadForm";
import { FloatingParticles } from "@/components/FloatingParticles";
import { CursorGlow } from "@/components/CursorGlow";
import { TiltCard } from "@/components/TiltCard";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/ScrollReveal";
import type { Product } from "@/lib/types";
import type { Settings } from "@/lib/settings";

export function HomePageContent({ products, settings }: { products: Product[]; settings: Settings }) {
  return (
    <main style={{ position: "relative" }}>
      <CursorGlow />
      <FloatingParticles />

      <nav className="nav">
        <Link className="brand" href="/">
          <motion.span
            className="brand-mark"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            GC
          </motion.span>
          <span>GwauCread</span>
        </Link>
        <div className="nav-links">
          <a href="#catalog">Каталог</a>
          <a href="#contact">Заявка</a>
        </div>
      </nav>

      <section className="hero" style={{ backgroundImage: "url('/gwaucread-hero.png')" }}>
        <div
          className="hero-shade"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,12,12,0.92) 0%, rgba(9,12,12,0.6) 40%, rgba(9,12,12,0.2) 70%), linear-gradient(180deg, rgba(9,12,12,0.4), rgba(9,12,12,0.2) 50%, var(--paper))",
          }}
        />
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {settings.heroEyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {settings.heroTitle}
            </motion.span>
          </motion.h1>

          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {settings.heroLead}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              className="button primary"
              href="#catalog"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Смотреть товары <ArrowRight size={18} />
            </motion.a>
            <motion.a
              className="button secondary"
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Оставить заявку
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <strong>{settings.heroPanel}</strong>
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            marginLeft: -12,
            zIndex: 2,
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} style={{ color: "var(--muted)" }} />
        </motion.div>
      </section>

      <ScrollReveal>
        <section className="section" id="catalog">
          <div className="section-head">
            <div>
              <p className="eyebrow">{settings.catalogEyebrow}</p>
              <h2>{settings.catalogTitle}</h2>
            </div>
            <p className="muted">{settings.catalogDesc}</p>
          </div>

          <StaggerReveal className="products">
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <TiltCard>
                  <div className="product-media">
                    {product.badge ? (
                      <motion.span
                        className="badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {product.badge}
                      </motion.span>
                    ) : null}
                    <img src={product.image} width={516} height={688} alt={product.name} />
                    <motion.div
                      className="product-shine"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                        opacity: 0,
                      }}
                      whileHover={{ opacity: 1, x: ["-100%", "100%"] }}
                      transition={{ duration: 0.8 }}
                    />
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
                      <motion.a
                        className="buy-button"
                        href={product.buyUrl || "#contact"}
                        target={product.buyUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <ShoppingBag size={18} />
                        Купить
                      </motion.a>
                      <a className="details-link" href="#contact">
                        Задать вопрос
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </section>
      </ScrollReveal>

      <motion.section
        className="contact-band"
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="contact-grid">
          <ScrollReveal direction="left">
            <div>
              <p className="eyebrow">{settings.contactEyebrow}</p>
              <h2>{settings.contactTitle}</h2>
              <p>{settings.contactDesc}</p>
              <motion.p
                style={{ marginTop: 18 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck size={18} /> Данные используются только для связи по заявке.
              </motion.p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.2}>
            <LeadForm products={products} />
          </ScrollReveal>
        </div>
      </motion.section>

      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="footer-inner">
          <div className="footer-brand">
            <motion.span
              className="brand-mark"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-flex", marginRight: 10 }}
            >
              GC
            </motion.span>
            <span className="footer-logo">GwauCread</span>
          </div>
          <div className="footer-links">
            <a href="#catalog">Каталог</a>
            <a href="#contact">Заявка</a>
            <a href="/privacy">Политика конфиденциальности</a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} GwauCread. Все права защищены.</span>
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="footer-tagline"
            >
              <Sparkles size={14} /> {settings.footerTagline}
            </motion.span>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
