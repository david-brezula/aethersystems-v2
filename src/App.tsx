import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Layers3,
  Menu,
  Pause,
  Play,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";
import LiquidScene from "./LiquidScene";
import { copy, services } from "./content";

type Language = "sk" | "en";
const email = "info@aethersystems.tech";
const stageIcons = [Workflow, Layers3, Code2, ShieldCheck];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#home"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="AETHER Systems"
    >
      <span className="brand-mark" aria-hidden="true">
        Λ<span>Ξ</span>
      </span>
      <span className="brand-word">
        AETHER<span>SYSTEMS</span>
      </span>
    </a>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      return localStorage.getItem("aether-language") === "en" ? "en" : "sk";
    } catch {
      return "sk";
    }
  });
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phase, setPhase] = useState(0);
  const [service, setService] = useState(0);
  const [detail, setDetail] = useState<number | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const contactDialog = useRef<HTMLDialogElement>(null);
  const serviceDialog = useRef<HTMLDialogElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "sk"
        ? "AETHER Systems | Vaša vízia. Náš systém."
        : "AETHER Systems | Your vision. Our system.";
    try {
      localStorage.setItem("aether-language", lang);
    } catch {
      /* Storage is optional. */
    }
  }, [lang]);

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setPaused(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (contactOpen) contactDialog.current?.showModal();
    else contactDialog.current?.close();
  }, [contactOpen]);
  useEffect(() => {
    if (detail !== null) serviceDialog.current?.showModal();
    else serviceDialog.current?.close();
  }, [detail]);
  useEffect(() => {
    if (menuOpen) menuDialog.current?.showModal();
    else menuDialog.current?.close();
  }, [menuOpen]);
  useEffect(() => {
    const open = contactOpen || detail !== null || menuOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [contactOpen, detail, menuOpen]);

  function selectService(index: number) {
    const bounded = Math.max(0, Math.min(services.length - 1, index));
    const container = rail.current;
    const item = container?.children[bounded] as HTMLElement | undefined;
    if (container && item)
      container.scrollTo({
        left: item.offsetLeft - container.offsetLeft,
        behavior: paused ? "instant" : "smooth",
      });
    setService(bounded);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  function sendProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(lang === "sk" ? "Nový projekt | AETHER Systems" : "New project | AETHER Systems")}&body=${encodeURIComponent(body)}`;
  }

  function closeMenu() {
    setMenuOpen(false);
  }
  const openContact = () => {
    setMenuOpen(false);
    setDetail(null);
    setContactOpen(true);
  };

  return (
    <>
      <a className="skip-link" href="#content">
        {lang === "sk" ? "Preskočiť na obsah" : "Skip to content"}
      </a>
      <header className={scrolled ? "header scrolled" : "header"}>
        <Brand />
        <nav
          className="desktop-nav"
          aria-label={lang === "sk" ? "Hlavná navigácia" : "Main navigation"}
        >
          <a href="#services">
            {t.nav[0]}
            <ChevronDown size={13} />
          </a>
          <a href="#methodology">{t.nav[1]}</a>
          <a href="#about">{t.nav[2]}</a>
        </nav>
        <div className="header-actions">
          <button
            className="language"
            onClick={() => setLang(lang === "sk" ? "en" : "sk")}
            aria-label={
              lang === "sk" ? "Switch to English" : "Prepnúť na slovenčinu"
            }
          >
            {lang.toUpperCase()}
            <span>/ {lang === "sk" ? "EN" : "SK"}</span>
          </button>
          <button className="button light header-cta" onClick={openContact}>
            {t.start}
            <ArrowUpRight size={17} />
          </button>
          <button
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label={t.openMenu}
            aria-expanded={menuOpen}
          >
            <Menu />
          </button>
        </div>
      </header>

      <main id="content">
        <div className="intro-world" id="home">
          <LiquidScene paused={paused} />
          <div className="world-grid" aria-hidden="true" />
          <section className="hero">
            <div className="hero-content">
              <p className="eyebrow hero-eyebrow">SOFTWARE ENGINEERING & AI</p>
              <h1>
                <span>AETHER</span>
                <strong>SYSTEMS.</strong>
              </h1>
              <div className="hero-copy">
                <p className="eyebrow">{t.hero}</p>
                <p>{t.intro}</p>
              </div>
              <a className="button outline" href="#methodology">
                {t.explore}
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="hero-bottom">
              <span className="eyebrow availability">
                <i />
                {t.available}
              </span>
              <a
                className="icon-button"
                href="#manifesto"
                aria-label={lang === "sk" ? "Prejsť nižšie" : "Scroll down"}
              >
                <ArrowDown size={18} />
              </a>
              <button
                className="icon-button motion-button"
                onClick={() => setPaused(!paused)}
                title={paused ? t.play : t.pause}
                aria-label={paused ? t.play : t.pause}
                aria-pressed={paused}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          </section>

          <section className="manifesto section-pad" id="manifesto">
            <div className="section-kicker">
              <span className="eyebrow">MANIFESTO</span>
              <span className="kicker-line" />
              <span className="eyebrow manifesto-values">
                STRATEGY&nbsp; / &nbsp;DESIGN&nbsp; / &nbsp;ENGINEERING
              </span>
            </div>
            <p className="manifesto-text reveal">
              {t.manifesto} <strong>{t.structure}</strong> {t.manifesto2}{" "}
              <strong>{t.systems}</strong> {t.manifesto3}{" "}
              <span className="outlined">{t.result}</span>
            </p>
          </section>
        </div>

        <section className="methodology section-pad" id="methodology">
          <div className="section-kicker">
            <span className="eyebrow">{t.methodology}</span>
            <span className="kicker-line" />
          </div>
          <h2 className="section-title reveal">{t.core}</h2>
          <div className="method-layout">
            <div
              className="phase-list"
              role="tablist"
              aria-label={t.core}
              aria-orientation="vertical"
            >
              {t.phases.map((item, i) => (
                <button
                  key={i}
                  id={`phase-tab-${i}`}
                  className={`phase ${phase === i ? "active" : ""}`}
                  role="tab"
                  aria-selected={phase === i}
                  aria-controls="phase-panel"
                  tabIndex={phase === i ? 0 : -1}
                  onClick={() => setPhase(i)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowDown", "ArrowUp", "Home", "End"].includes(
                        event.key,
                      )
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? 3
                            : (i + (event.key === "ArrowDown" ? 1 : 3)) % 4;
                      setPhase(next);
                      document.getElementById(`phase-tab-${next}`)?.focus();
                    }
                  }}
                >
                  <span className="phase-heading">
                    <span className="eyebrow">0{i + 1}</span>
                    {item[0]}
                  </span>
                  <span className="phase-description">{item[1]}</span>
                </button>
              ))}
            </div>
            <div
              className="architecture"
              id="phase-panel"
              role="tabpanel"
              aria-labelledby={`phase-tab-${phase}`}
            >
              <div className="architecture-header">
                <h3>The Growth Bridge</h3>
                <span className="eyebrow">AETHER / PROCESS V.01</span>
              </div>
              <div className="control-plane">
                <span className="eyebrow">BUSINESS STRATEGY</span>
                <span className="control-line" />
                <span className="eyebrow">CONTINUOUS EVOLUTION</span>
              </div>
              <div className="pipeline">
                {t.phases.map((item, i) => {
                  const Icon = stageIcons[i];
                  return (
                    <button
                      className={`pipeline-node ${i === phase ? "active" : ""} ${i < phase ? "done" : ""}`}
                      key={i}
                      onClick={() => setPhase(i)}
                      aria-label={item[2]}
                      aria-pressed={phase === i}
                    >
                      <span className="eyebrow">0{i + 1}</span>
                      <Icon size={32} strokeWidth={1} />
                      <span>{item[0]}</span>
                      <i className="node-signal" />
                    </button>
                  );
                })}
              </div>
              <div className="architecture-detail">
                <span className="eyebrow">
                  0{phase + 1} / {t.phases[phase][2]}
                </span>
                <p>{t.phases[phase][1]}</p>
              </div>
              <div className="architecture-bottom">
                <span className="eyebrow">YOUR VISION → YOUR PRODUCT</span>
                <span className="phase-progress" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <i key={i} className={i <= phase ? "on" : ""} />
                  ))}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="section-pad service-heading">
            <div className="section-kicker">
              <span className="eyebrow">{t.capabilities}</span>
              <span className="kicker-line" />
            </div>
            <div className="heading-with-actions">
              <h2 className="display-title reveal">
                {t.engineered}
                <strong>{t.scale}</strong>
              </h2>
              <div className="rail-actions">
                <button
                  className="icon-button"
                  disabled={service === 0}
                  onClick={() => selectService(service - 1)}
                  aria-label={t.prev}
                  title={t.prev}
                >
                  <ArrowLeft />
                </button>
                <button
                  className="icon-button"
                  disabled={service === services.length - 1}
                  onClick={() => selectService(service + 1)}
                  aria-label={t.next}
                  title={t.next}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
          <div
            className="service-rail"
            ref={rail}
            onScroll={() => {
              const el = rail.current;
              if (!el || !el.children[0]) return;
              const width = (el.children[0] as HTMLElement).offsetWidth + 24;
              setService(
                Math.min(
                  services.length - 1,
                  Math.round(el.scrollLeft / width),
                ),
              );
            }}
          >
            {services.map((item, i) => (
              <button
                key={item.name}
                className="service-card"
                onClick={() => setDetail(i)}
                aria-haspopup="dialog"
              >
                <div className="service-top">
                  <span className="eyebrow">0{i + 1}</span>
                  <span className="eyebrow service-tags">{item.tags}</span>
                </div>
                <item.icon className="service-icon" size={32} strokeWidth={1} />
                <h3>{item.name}</h3>
                <p>{item[lang]}</p>
                <span className="service-bottom eyebrow">
                  {t.more}
                  <ArrowUpRight size={16} />
                </span>
                <span className="service-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
          <div className="service-index section-pad" aria-label={t.services}>
            {services.map((item, i) => (
              <button
                className={`eyebrow ${service === i ? "active" : ""}`}
                key={i}
                onClick={() => selectService(i)}
                aria-current={service === i ? "true" : undefined}
              >
                <span>0{i + 1}</span>
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <section className="about section-pad" id="about">
          <div className="section-kicker">
            <span className="eyebrow">{t.aboutLabel}</span>
            <span className="kicker-line" />
          </div>
          <div className="about-layout">
            <h2 className="display-title reveal">
              {t.aboutTitle}
              <strong>{t.aboutBold}</strong>
            </h2>
            <div className="about-copy">
              <p>{t.about}</p>
              <ul>
                {t.principles.map((item, i) => (
                  <li key={item}>
                    <span className="eyebrow">0{i + 1}</span>
                    {item}
                    <ArrowUpRight size={17} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="lab section-pad" id="lab">
          <div className="section-kicker">
            <span className="eyebrow">{t.lab}</span>
            <span className="kicker-line" />
          </div>
          <div className="lab-layout">
            <div>
              <h2>
                BaseVenture
                <span className="status-dot" />
              </h2>
              <h3>{t.labCopy}</h3>
              <p>{t.labDesc}</p>
              <button className="text-link" onClick={openContact}>
                {t.start}
                <ArrowUpRight size={18} />
              </button>
            </div>
            <div
              className="stack-visual"
              aria-label="BaseVenture: authentication, payments, email and deployment"
            >
              <div className="stack-top eyebrow">
                <span>BASEVENTURE</span>
                <span>FOUNDATION / 01</span>
              </div>
              {[
                "Authentication",
                "Payments",
                "Email infrastructure",
                "CI / CD",
              ].map((item, i) => (
                <div className="stack-row" key={item}>
                  <span className="eyebrow">0{i + 1}</span>
                  <span>{item}</span>
                  <Check size={17} />
                </div>
              ))}
              <div className="stack-product">
                <Code2 size={20} />
                <span>YOUR PRODUCT</span>
                <ArrowUpRight size={22} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <section className="contact section-pad">
          <span className="eyebrow availability">
            <i />
            {t.available}
          </span>
          <h2 className="display-title reveal">
            {t.contactTitle}
            <strong>{t.contactBold}</strong>
          </h2>
          <div className="contact-bottom">
            <p>{t.contactDesc}</p>
            <button className="button light" onClick={openContact}>
              {t.start}
              <ArrowUpRight size={20} />
            </button>
          </div>
        </section>
        <div className="footer-main section-pad">
          <div className="footer-company">
            <Brand footer />
            <p>{t.footer}</p>
            <div className="email-line">
              <a href={`mailto:${email}`}>{email}</a>
              <button
                className="icon-button"
                onClick={copyEmail}
                aria-label={copied ? t.copied : t.copy}
                title={copied ? t.copied : t.copy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <span className="sr-only" role="status">
              {copied ? t.copied : ""}
            </span>
          </div>
          <div className="footer-links">
            <span className="eyebrow">01 / {t.services}</span>
            {services.slice(0, 5).map((item, i) => (
              <button key={item.name} onClick={() => setDetail(i)}>
                {item.name}
              </button>
            ))}
          </div>
          <div className="footer-links">
            <span className="eyebrow">02 / {t.company}</span>
            <a href="#methodology">{t.nav[1]}</a>
            <a href="#about">{t.nav[2]}</a>
            <a href="#lab">Innovation Lab</a>
            <button onClick={openContact}>{t.start}</button>
          </div>
        </div>
        <div className="footer-bottom section-pad">
          <span className="eyebrow">
            © {new Date().getFullYear()} AETHER SYSTEMS
          </span>
          <span className="eyebrow">YOUR VISION. OUR SYSTEM.</span>
          <a href="#home" className="text-link">
            {t.top}
            <ArrowUp size={16} />
          </a>
        </div>
      </footer>

      <dialog
        ref={menuDialog}
        className="mobile-dialog"
        aria-label={t.openMenu}
        onCancel={() => setMenuOpen(false)}
        onClose={() => setMenuOpen(false)}
      >
        <div className="mobile-dialog-top">
          <Brand />
          <button
            className="icon-button"
            onClick={closeMenu}
            aria-label={t.close}
          >
            <X />
          </button>
        </div>
        <nav aria-label={t.openMenu}>
          {["services", "methodology", "about"].map((id, i) => (
            <a key={id} href={`#${id}`} onClick={closeMenu}>
              <span className="eyebrow">0{i + 1}</span>
              {t.nav[i]}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
        <button className="button light" onClick={openContact}>
          {t.start}
          <ArrowUpRight size={20} />
        </button>
        <a className="mobile-email" href={`mailto:${email}`}>
          {email}
        </a>
      </dialog>

      <dialog
        ref={serviceDialog}
        className="detail-dialog"
        aria-labelledby="service-dialog-title"
        onCancel={() => setDetail(null)}
        onClose={() => setDetail(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setDetail(null);
        }}
      >
        <div className="dialog-body">
          <button
            className="icon-button dialog-close"
            aria-label={t.close}
            onClick={() => setDetail(null)}
          >
            <X />
          </button>
          {detail !== null && (
            <>
              <span className="eyebrow">
                0{detail + 1} / {t.services}
              </span>
              <h2 id="service-dialog-title">{services[detail].name}</h2>
              <span className="eyebrow">{services[detail].tags}</span>
              <p>
                {lang === "sk"
                  ? services[detail].detailSk
                  : services[detail].detailEn}
              </p>
              <button className="button light" onClick={openContact}>
                {t.start}
                <ArrowUpRight size={18} />
              </button>
            </>
          )}
        </div>
      </dialog>

      <dialog
        ref={contactDialog}
        className="contact-dialog"
        aria-labelledby="contact-dialog-title"
        onCancel={() => setContactOpen(false)}
        onClose={() => setContactOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setContactOpen(false);
        }}
      >
        <div className="dialog-body">
          <button
            className="icon-button dialog-close"
            aria-label={t.close}
            onClick={() => setContactOpen(false)}
          >
            <X />
          </button>
          <span className="eyebrow">AETHER / LET’S BUILD</span>
          <h2 id="contact-dialog-title">{t.formTitle}</h2>
          <p>{t.formDesc}</p>
          <form onSubmit={sendProject}>
            <label>
              {t.name}
              <input name="name" autoComplete="name" required maxLength={120} />
            </label>
            <label>
              {t.email}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
            <label>
              {t.message}
              <textarea name="message" required rows={4} maxLength={3000} />
            </label>
            <button className="button light" type="submit">
              {t.submit}
              <ArrowUpRight size={18} />
            </button>
          </form>
          <a className="dialog-email" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </dialog>
    </>
  );
}
