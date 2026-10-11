import { useEffect, useRef, useState } from "react";
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
import PageContent from "./PageContent";
import { pageByPath, servicePaths } from "./pages";

type Language = "sk" | "en";
const email = "info@aethersystems.tech";
const stageIcons = [Workflow, Layers3, Code2, ShieldCheck];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="/"
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

export default function App({ initialPath }: { initialPath?: string } = {}) {
  const path =
    (
      initialPath ??
      (typeof window !== "undefined" ? window.location.pathname : "/")
    ).replace(/\/$/, "") || "/";
  const isHome = path === "/";
  const page = pageByPath(path);
  const [lang, setLang] = useState<Language>(() => {
    try {
      return localStorage.getItem("aether-language") === "en" ? "en" : "sk";
    } catch {
      return "sk";
    }
  });
  const [paused, setPaused] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phase, setPhase] = useState(0);
  const [service, setService] = useState(0);
  const [copied, setCopied] = useState(false);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = !isHome
      ? `${page ? `${page.title[lang]} ${page.strong[lang]}` : "404"} | AETHER Systems`
      : lang === "sk"
        ? "AETHER Systems | Vaša vízia. Náš systém."
        : "AETHER Systems | Your vision. Our system.";
    try {
      localStorage.setItem("aether-language", lang);
    } catch {
      /* Storage is optional. */
    }
    if (page)
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", page.intro[lang]);
  }, [lang, page, isHome]);

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
    if (menuOpen) menuDialog.current?.showModal();
    else menuDialog.current?.close();
  }, [menuOpen]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      let anchor = window.location.hash.slice(1);
      try {
        anchor = decodeURIComponent(anchor);
      } catch {
        return;
      }
      document
        .getElementById(anchor)
        ?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

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

  function closeMenu() {
    setMenuOpen(false);
  }
  const openContact = () => {
    window.location.assign("/contact#brief");
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
          <details className="services-menu">
            <summary>
              {t.nav[0]}
              <ChevronDown size={13} />
            </summary>
            <div className="services-dropdown">
              {services.map((item, i) => (
                <a
                  key={item.name}
                  href={servicePaths[i]}
                  aria-current={path === servicePaths[i] ? "page" : undefined}
                >
                  <span className="eyebrow">0{i + 1}</span>
                  {item.name}
                  <ArrowUpRight size={15} />
                </a>
              ))}
              <div className="dropdown-platforms">
                <a href="/databricks-consulting">BaseVenture</a>
                <a href="/microsoft-data-ai-consulting">Cloud & AI</a>
              </div>
            </div>
          </details>
          <a
            href="/case-studies"
            aria-current={path.startsWith("/case-studies") ? "page" : undefined}
          >
            {lang === "sk" ? "Projekty" : "Outcomes"}
          </a>
          <a
            href="/about"
            aria-current={path === "/about" ? "page" : undefined}
          >
            {t.nav[2]}
          </a>
          <a
            href="/careers"
            aria-current={path === "/careers" ? "page" : undefined}
          >
            {lang === "sk" ? "Kariéra" : "Careers"}
          </a>
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
        {isHome ? (
          <>
            <div className="intro-world" id="home">
              <LiquidScene paused={paused} />
              <div className="world-grid" aria-hidden="true" />
              <section className="hero">
                <div className="hero-content">
                  <p className="eyebrow hero-eyebrow">
                    SOFTWARE ENGINEERING & AI
                  </p>
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
                  const width =
                    (el.children[0] as HTMLElement).offsetWidth + 24;
                  setService(
                    Math.min(
                      services.length - 1,
                      Math.round(el.scrollLeft / width),
                    ),
                  );
                }}
              >
                {services.map((item, i) => (
                  <a
                    key={item.name}
                    className="service-card"
                    href={servicePaths[i]}
                  >
                    <div className="service-top">
                      <span className="eyebrow">0{i + 1}</span>
                      <span className="eyebrow service-tags">{item.tags}</span>
                    </div>
                    <item.icon
                      className="service-icon"
                      size={32}
                      strokeWidth={1}
                    />
                    <h3>{item.name}</h3>
                    <p>{item[lang]}</p>
                    <span className="service-bottom eyebrow">
                      {t.more}
                      <ArrowUpRight size={16} />
                    </span>
                    <span className="service-number" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </a>
                ))}
              </div>
              <div
                className="service-index section-pad"
                aria-label={t.services}
              >
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
          </>
        ) : (
          <PageContent page={page} lang={lang} />
        )}
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
            {services.map((item, i) => (
              <a key={item.name} href={servicePaths[i]}>
                {item.name}
              </a>
            ))}
          </div>
          <div className="footer-links">
            <span className="eyebrow">02 / {t.company}</span>
            <a href="/case-studies">
              {lang === "sk" ? "Projekty" : "Outcomes"}
            </a>
            <a href="/about">{t.nav[2]}</a>
            <a href="/careers">{lang === "sk" ? "Kariéra" : "Careers"}</a>
            <a href="/databricks-consulting">BaseVenture</a>
            <a href="/microsoft-data-ai-consulting">Cloud & AI</a>
            <a href="/contact">{t.start}</a>
          </div>
        </div>
        <div className="footer-bottom section-pad">
          <span className="eyebrow">
            © {new Date().getFullYear()} AETHER SYSTEMS
          </span>
          <div className="legal-links">
            <a href="/privacy">{lang === "sk" ? "Súkromie" : "Privacy"}</a>
            <a href="/terms">
              {lang === "sk" ? "Podmienky používania" : "Terms of use"}
            </a>
          </div>
          <a href="#content" className="text-link">
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
          {[
            ["/case-studies", lang === "sk" ? "Projekty" : "Outcomes"],
            ["/about", t.nav[2]],
            ["/careers", lang === "sk" ? "Kariéra" : "Careers"],
            ["/contact", lang === "sk" ? "Kontakt" : "Contact"],
          ].map(([id, label], i) => (
            <a key={id} href={id} onClick={closeMenu}>
              <span className="eyebrow">0{i + 1}</span>
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
        <div className="mobile-services">
          <span className="eyebrow">{t.services}</span>
          {services.map((item, i) => (
            <a href={servicePaths[i]} key={item.name}>
              {item.name}
              <ArrowUpRight size={15} />
            </a>
          ))}
          <a href="/databricks-consulting">
            BaseVenture
            <ArrowUpRight size={15} />
          </a>
          <a href="/microsoft-data-ai-consulting">
            Cloud & AI
            <ArrowUpRight size={15} />
          </a>
        </div>
        <button className="button light" onClick={openContact}>
          {t.start}
          <ArrowUpRight size={20} />
        </button>
        <a className="mobile-email" href={`mailto:${email}`}>
          {email}
        </a>
      </dialog>
    </>
  );
}
