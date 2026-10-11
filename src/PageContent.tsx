import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Database,
  Download,
  GitBranch,
  Layers3,
  Network,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  bi,
  casePages,
  pageByPath,
  pages,
  servicePaths,
  type Chapter,
  type Lang,
  type Page,
  type Text,
} from "./pages";
import { services } from "./content";

const choose = (lang: Lang, sk: string, en: string) =>
  lang === "sk" ? sk : en;
const num = (n: number) => String(n + 1).padStart(2, "0");
const icons = [Database, Network, Layers3, Code2, ShieldCheck];

function Architecture({
  nodes,
  lang,
  compact = false,
}: {
  nodes: string[];
  lang: Lang;
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className={`system-diagram ${compact ? "compact" : ""}`}>
      <div className="diagram-meta eyebrow">
        <span>AETHER / SYSTEM ARCHITECTURE</span>
        <span>01—{num(nodes.length - 1)}</span>
      </div>
      <div className="diagram-governance">
        <span>STRATEGY</span>
        <i />
        <span>QUALITY & OWNERSHIP</span>
      </div>
      <div className="diagram-nodes">
        {nodes.map((node, i) => {
          const Icon = icons[i % icons.length];
          return (
            <button
              key={node}
              className={active === i ? "selected" : ""}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              aria-label={node}
            >
              <small className="eyebrow">{num(i)}</small>
              <Icon strokeWidth={1} />
              <span>{node}</span>
            </button>
          );
        })}
      </div>
      <div className="diagram-description" aria-live="polite">
        <span className="eyebrow">
          {num(active)} / {nodes[active]}
        </span>
        <p>
          {choose(
            lang,
            "Samostatná súčasť systému s definovaným vstupom, výstupom a nadväznosťami.",
            "A distinct system component with defined inputs, outputs and connections.",
          )}
        </p>
      </div>
      <div className="diagram-meta eyebrow">
        <span>INPUT → PROCESS → OUTCOME</span>
        <span>{nodes[active]}</span>
      </div>
    </div>
  );
}

function Comparison({ lang, page }: { lang: Lang; page: Page }) {
  return (
    <div className="comparison">
      <article>
        <span className="eyebrow">{choose(lang, "DNES", "CURRENT")}</span>
        <h3>{choose(lang, "Roztrieštená práca.", "Fragmented work.")}</h3>
        <p>{page.intro[lang]}</p>
        <div className="fragmented-mark" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i
              key={i}
              style={{
                width: `${22 + ((i * 19) % 65)}%`,
                transform: `translateX(${(i * 13) % 21}px)`,
              }}
            />
          ))}
        </div>
      </article>
      <article>
        <span className="eyebrow">{choose(lang, "ĎALŠÍ KROK", "TARGET")}</span>
        <h3>{choose(lang, "Prepojený systém.", "A connected system.")}</h3>
        <p>
          {choose(
            lang,
            "Jasný proces, spoločné informácie a riešenie postavené okolo vašich priorít.",
            "A clear process, shared information and a solution built around your priorities.",
          )}
        </p>
        <div className="structured-mark" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </article>
    </div>
  );
}

function Capabilities({ items, lang }: { items: Text[]; lang: Lang }) {
  const [active, setActive] = useState(0);
  const Icon = icons[active % icons.length];
  return (
    <div className="capabilities-panel">
      <div className="capability-selector">
        {items.map((item, i) => (
          <button
            key={i}
            aria-pressed={active === i}
            className={active === i ? "active" : ""}
            onClick={() => setActive(i)}
          >
            <span className="eyebrow">{num(i)}</span>
            {item[lang]}
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      <div className="capability-content">
        <span className="eyebrow">{num(active)} / AETHER SYSTEMS</span>
        <h3>{items[active][lang]}</h3>
        <Icon size={90} strokeWidth={0.65} />
        <p>
          {choose(
            lang,
            "Od pochopenia požiadavky cez návrh rozhrania až po overenie v praxi. Každá súčasť musí zapadnúť do celého produktu.",
            "From understanding a requirement through interface design to validation in practice. Every component must fit the whole product.",
          )}
        </p>
      </div>
    </div>
  );
}

const sampleRows = [
  { name: "Portal", q: [32, 44, 51, 63], status: "Active" },
  { name: "Automation", q: [21, 29, 40, 52], status: "Active" },
  { name: "Integration", q: [16, 23, 36, 48], status: "Review" },
];
function Dashboard({ lang, mobile = false }: { lang: Lang; mobile?: boolean }) {
  const [quarter, setQuarter] = useState("all");
  const [project, setProject] = useState("all");
  const rows = sampleRows.filter(
    (r) => project === "all" || r.name === project,
  );
  const value = (r: (typeof sampleRows)[number]) =>
    quarter === "all" ? r.q.reduce((a, b) => a + b, 0) : r.q[Number(quarter)];
  const total = rows.reduce((sum, r) => sum + value(r), 0);
  function download() {
    const csv =
      "Project,Completed items,Status\n" +
      rows.map((r) => `${r.name},${value(r)},${r.status}`).join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "aether-demo-report.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className={`demo-dashboard ${mobile ? "phone-dashboard" : ""}`}>
      <div className="dashboard-header">
        <span className="eyebrow">AETHER / WORKSPACE</span>
        <span className="demo-label">
          {choose(lang, "Modelové údaje", "Sample data")}
        </span>
      </div>
      <div className="dashboard-filters">
        <label>
          {choose(lang, "Obdobie", "Period")}
          <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
            <option value="all">{choose(lang, "Celý rok", "Full year")}</option>
            {[0, 1, 2, 3].map((q) => (
              <option key={q} value={q}>
                Q{q + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          {choose(lang, "Projekt", "Project")}
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="all">
              {choose(lang, "Všetky projekty", "All projects")}
            </option>
            {sampleRows.map((r) => (
              <option key={r.name}>{r.name}</option>
            ))}
          </select>
        </label>
        <button
          className="icon-button"
          onClick={download}
          title={choose(lang, "Stiahnuť CSV", "Download CSV")}
          aria-label={choose(lang, "Stiahnuť CSV", "Download CSV")}
        >
          <Download size={18} />
        </button>
      </div>
      <div className="dashboard-kpis">
        <div>
          <span>{choose(lang, "Dokončené úlohy", "Completed items")}</span>
          <strong>{total}</strong>
        </div>
        <div>
          <span>{choose(lang, "Projekty", "Projects")}</span>
          <strong>{rows.length}</strong>
        </div>
        <div>
          <span>
            {choose(lang, "Priemer na projekt", "Average per project")}
          </span>
          <strong>{Math.round(total / rows.length)}</strong>
        </div>
      </div>
      <div
        className="dashboard-chart"
        aria-label={choose(lang, "Úlohy podľa štvrťroka", "Items by quarter")}
      >
        {[0, 1, 2, 3].map((q) => (
          <div key={q}>
            <i
              style={{
                height: `${rows.reduce((s, r) => s + r.q[q], 0) / 2}px`,
                opacity: quarter === "all" || Number(quarter) === q ? 1 : 0.25,
              }}
            />
            <span>Q{q + 1}</span>
          </div>
        ))}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{choose(lang, "Projekt", "Project")}</th>
              <th>{choose(lang, "Dokončené", "Completed")}</th>
              <th>{choose(lang, "Stav", "Status")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{value(r)}</td>
                <td>
                  <span className="table-status">{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Assistant({ lang }: { lang: Lang }) {
  const [topic, setTopic] = useState(0);
  const topics = [
    bi("Čo vytvárate?", "What do you build?"),
    bi("Ako začína projekt?", "How does a project start?"),
    bi("Čo je BaseVenture?", "What is BaseVenture?"),
  ];
  const answers = [
    bi(
      "Vytvárame MVP, webové aplikácie a PWA, automatizácie s AI aj systémové integrácie. Pomáhame tiež s modernizáciou a dlhodobým rozvojom softvéru.",
      "We build MVPs, web applications and PWAs, AI automation and system integrations. We also help modernize and evolve software.",
    ),
    bi(
      "Začíname rozhovorom a discovery workshopom. Ujasníme si cieľ, používateľov, rozsah a technické obmedzenia. Potom navrhneme postup.",
      "We start with a conversation and discovery workshop. We clarify the goal, users, scope and technical constraints, then propose a plan.",
    ),
    bi(
      "BaseVenture je interný modulárny základ AETHER pre autentifikáciu, platby, e-mail a CI/CD. Umožňuje sústrediť sa na jedinečné časti produktu.",
      "BaseVenture is AETHER’s internal modular foundation for authentication, payments, email and CI/CD. It lets us focus on the unique parts of a product.",
    ),
  ];
  return (
    <div className="assistant-demo">
      <div className="dashboard-header">
        <span className="eyebrow">
          <Bot size={16} /> AETHER / KNOWLEDGE
        </span>
        <span className="demo-label">
          {choose(lang, "Ukážka odpovedí", "Sample answers")}
        </span>
      </div>
      <div className="assistant-question">{topics[topic][lang]}</div>
      <div className="assistant-answer" aria-live="polite">
        <Bot size={22} />
        <p>{answers[topic][lang]}</p>
      </div>
      <div className="assistant-topics">
        {topics.map((t, i) => (
          <button
            key={i}
            aria-pressed={i === topic}
            onClick={() => setTopic(i)}
          >
            {t[lang]}
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      <a className="text-link" href="/contact">
        {choose(lang, "Prebrať konkrétny projekt", "Discuss your project")}
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}

function Gates({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const labels = [
    bi("Zmapovať", "Discover"),
    bi("Navrhnúť", "Design"),
    bi("Implementovať", "Implement"),
    bi("Overiť", "Validate"),
    bi("Odovzdať", "Deliver"),
  ];
  const descriptions = [
    bi(
      "Inventár systémov, dát, rozhraní a závislostí určí východiskový stav.",
      "An inventory of systems, data, interfaces and dependencies establishes the starting point.",
    ),
    bi(
      "Cieľový návrh definuje zodpovednosti jednotlivých častí a postup prechodu.",
      "The target design defines component responsibilities and a transition plan.",
    ),
    bi(
      "Úpravy realizujeme po menších celkoch, ktoré sa dajú samostatne overiť.",
      "Changes are implemented in smaller units that can be validated independently.",
    ),
    bi(
      "Kontrolujeme dáta, správanie a požiadavky používateľov pred nasadením.",
      "Validate data, behaviour and user requirements before deployment.",
    ),
    bi(
      "Riešenie odovzdáme s kontextom potrebným pre prevádzku a ďalší rozvoj.",
      "Hand over the solution with the context needed for operation and further development.",
    ),
  ];
  return (
    <div className="gates">
      <div className="gate-tabs">
        {labels.map((l, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-pressed={step === i}
            className={step === i ? "active" : ""}
          >
            <span className="eyebrow">{num(i)}</span>
            {l[lang]}
          </button>
        ))}
      </div>
      <div className="gate-detail">
        <span className="gate-number">{num(step)}</span>
        <div>
          <span className="eyebrow">AETHER / DELIVERY GATE</span>
          <h3>{labels[step][lang]}</h3>
          <p>{descriptions[step][lang]}</p>
        </div>
        <ShieldCheck size={72} strokeWidth={0.75} />
      </div>
    </div>
  );
}

export function createProjectMailto(data: FormData, lang: Lang) {
  const body = [
    data.get("message"),
    "",
    `${choose(lang, "Meno", "Name")}: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `${choose(lang, "Firma", "Company")}: ${data.get("company") || "-"}`,
    `${choose(lang, "Rozsah", "Scope")}: ${data.get("scale") || "-"}`,
  ].join("\n");
  return `mailto:info@aethersystems.tech?subject=${encodeURIComponent(choose(lang, "Nový projekt | AETHER Systems", "New project | AETHER Systems"))}&body=${encodeURIComponent(body)}`;
}

function ProjectForm({ lang }: { lang: Lang }) {
  const [prepared, setPrepared] = useState(false);
  const [mail, setMail] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = createProjectMailto(new FormData(e.currentTarget), lang);
    setMail(url);
    setPrepared(true);
    window.location.href = url;
  };
  return (
    <div className="project-brief">
      <div className="brief-copy">
        <span className="eyebrow">YOUR VISION / OUR SYSTEM</span>
        <h3>
          {choose(lang, "Kam chcete ísť", "Where do you want to go")}
          <strong>{choose(lang, "ďalej.", "next.")}</strong>
        </h3>
        <p>
          {choose(
            lang,
            "Opíšte svoj cieľ, dôležité obmedzenia a predstavu o termíne. Správu dokončíte a odošlete vo svojom e-mailovom klientovi.",
            "Describe your goal, important constraints and timeline. You will finish and send the message in your email client.",
          )}
        </p>
        <a href="mailto:info@aethersystems.tech">info@aethersystems.tech</a>
      </div>
      <form ref={form} onSubmit={submit}>
        <div className="form-pair">
          <label>
            {choose(lang, "Meno a priezvisko", "Full name")}
            <input name="name" required autoComplete="name" maxLength={120} />
          </label>
          <label>
            {choose(lang, "Pracovný e-mail", "Work email")}
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
            />
          </label>
        </div>
        <label>
          {choose(lang, "Firma", "Company")}
          <input name="company" autoComplete="organization" maxLength={160} />
        </label>
        <label>
          {choose(lang, "Rozsah projektu", "Project scope")}
          <select name="scale" defaultValue="" required>
            <option value="" disabled>
              {choose(lang, "Vyberte možnosť", "Select an option")}
            </option>
            {[
              "Discovery / Strategy",
              "MVP / New product",
              "Integration / Automation",
              "Scaling / Modernization",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          {choose(
            lang,
            "Aký výsledok potrebujete?",
            "What outcome do you need?",
          )}
          <textarea name="message" required rows={5} maxLength={3000} />
        </label>
        <button className="button outline" type="submit">
          {choose(lang, "Pokračovať v e-maile", "Continue in email")}
          <Send size={16} />
        </button>
        {prepared && (
          <p role="status" className="form-status">
            {choose(
              lang,
              "Správa je pripravená v e-mailovom klientovi.",
              "Your message is ready in your email client.",
            )}{" "}
            <a href={mail}>{choose(lang, "Otvoriť znova", "Open again")}</a>
          </p>
        )}
        <a href="/privacy" className="form-privacy">
          {choose(lang, "Informácie o súkromí", "Privacy information")}
        </a>
      </form>
    </div>
  );
}

function Related({ paths, lang }: { paths: string[]; lang: Lang }) {
  return (
    <div className="related-grid">
      {paths.map((path) => {
        const page = pageByPath(path);
        return page ? (
          <a href={path} key={path}>
            <span className="eyebrow">{page.category[lang]}</span>
            <h3>
              {page.title[lang]} {page.strong[lang]}
            </h3>
            <p>{page.intro[lang]}</p>
            <span className="text-link">
              {choose(lang, "Preskúmať", "Explore")}
              <ArrowUpRight size={18} />
            </span>
          </a>
        ) : null;
      })}
    </div>
  );
}

function FAQ({ lang }: { lang: Lang }) {
  const questions = [
    bi("Kde začneme?", "Where do we start?"),
    bi("Ako určíte cenu a rozsah?", "How are price and scope defined?"),
    bi(
      "Môžeme rozvíjať existujúci systém?",
      "Can you evolve an existing system?",
    ),
  ];
  const answers = [
    bi(
      "Úvodným rozhovorom a discovery workshopom. Potrebujeme pochopiť cieľ, používateľov a existujúce prostredie.",
      "With a conversation and discovery workshop. We need to understand your goal, users and existing environment.",
    ),
    bi(
      "Podľa dohodnutých požiadaviek a priorít. Pri MVP definujeme pevný rozsah a cenu pred implementáciou.",
      "Based on agreed requirements and priorities. For MVPs, scope and a fixed price are defined before implementation.",
    ),
    bi(
      "Áno. Modernizácia, integrácie a dlhodobý rozvoj patria medzi služby AETHER. Najprv spoločne posúdime aktuálny stav.",
      "Yes. Modernization, integrations and long-term product evolution are among AETHER’s services. We first assess the current state together.",
    ),
  ];
  return (
    <div className="faq">
      {questions.map((q, i) => (
        <details key={i}>
          <summary>
            <span className="eyebrow">{num(i)}</span>
            {q[lang]}
            <ChevronDown size={18} />
          </summary>
          <p>{answers[i][lang]}</p>
        </details>
      ))}
    </div>
  );
}

function SectionBody({
  chapter,
  page,
  lang,
}: {
  chapter: Chapter;
  page: Page;
  lang: Lang;
}) {
  const id = chapter.id;
  if (id === "paradigm" || id === "situation")
    return <Comparison lang={lang} page={page} />;
  if (["architecture", "platform", "streaming"].includes(id))
    return (
      <>
        <Architecture
          nodes={page.nodes || ["Discover", "Design", "Build", "Launch"]}
          lang={lang}
        />
        <details className="architecture-notes">
          <summary>
            {choose(lang, "Poznámky k návrhu", "Architecture notes")}
            <ChevronDown size={16} />
          </summary>
          <p>
            {choose(
              lang,
              "Schéma ukazuje logické časti riešenia. Konkrétne technológie, prístupy k dátam a prevádzkové požiadavky sa spresňujú počas discovery.",
              "The diagram shows logical components. Specific technologies, data access and operating requirements are established during discovery.",
            )}
          </p>
        </details>
      </>
    );
  if (
    id === "insights" ||
    (page.path.endsWith("pricing-desk-databricks-app") && id === "delivery")
  )
    return <Dashboard lang={lang} />;
  if (id === "mobile")
    return (
      <div className="mobile-showcase">
        <div>
          <span className="eyebrow">WEB / PWA</span>
          <h3>
            {choose(
              lang,
              "Dôležité informácie. Vždy poruke.",
              "Important information. Always at hand.",
            )}
          </h3>
          <ul>
            <li>
              {choose(lang, "Responzívne rozhranie", "Responsive interface")}
            </li>
            <li>
              {choose(
                lang,
                "Spoločné dáta a procesy",
                "Shared data and workflows",
              )}
            </li>
            <li>{choose(lang, "Prístup podľa role", "Role-based access")}</li>
          </ul>
        </div>
        <Dashboard lang={lang} mobile />
      </div>
    );
  if (id === "reports") return <Dashboard lang={lang} />;
  if (id === "assistant") return <Assistant lang={lang} />;
  if (id === "gates") return <Gates lang={lang} />;
  if (id === "tracks")
    return (
      <Related
        paths={[
          "/migration-to-databricks",
          "/migration-to-fabric",
          "/ssrs-to-power-bi-migration",
        ]}
        lang={lang}
      />
    );
  if (id === "questions") return <FAQ lang={lang} />;
  if (id === "brief") return <ProjectForm lang={lang} />;
  if (id === "security")
    return (
      <div className="security-trace">
        {[
          bi("Schválené podklady", "Approved knowledge"),
          bi("Povolené nástroje", "Permitted tools"),
          bi("Citlivé zmeny", "Sensitive changes"),
        ].map((x, i) => (
          <div key={i}>
            <span className="eyebrow">0{i + 1}</span>
            <span>{x[lang]}</span>
            <span className={i === 2 ? "held" : "allowed"}>
              {i === 2
                ? choose(lang, "Schválenie človekom", "Human approval")
                : choose(lang, "Definovaný prístup", "Defined access")}
            </span>
            <ShieldCheck size={20} />
          </div>
        ))}
      </div>
    );
  if (id === "core")
    return (
      <Capabilities
        items={services.map((s) => bi(s.name, s.name))}
        lang={lang}
      />
    );
  if (id === "apply")
    return (
      <a
        href="mailto:info@aethersystems.tech?subject=AETHER%20%7C%20Collaboration"
        className="portfolio-link"
      >
        info@aethersystems.tech
        <ArrowUpRight />
      </a>
    );
  if (chapter.items) {
    if (["systems", "foundry", "control"].includes(id))
      return <Capabilities items={chapter.items} lang={lang} />;
    return (
      <div
        className={`numbered-grid ${page.kind === "contact" ? "process-steps" : ""}`}
      >
        {chapter.items.map((item, i) => (
          <article key={i}>
            <span className="eyebrow">{num(i)}</span>
            <h3>{item[lang]}</h3>
            <p>
              {choose(
                lang,
                "Jasný cieľ, zrozumiteľný výstup a nadväznosť na ďalší krok.",
                "A clear objective, an understandable outcome and a connection to the next step.",
              )}
            </p>
          </article>
        ))}
      </div>
    );
  }
  if (id === "outcomes")
    return (
      <div className="case-result">
        <Check size={35} strokeWidth={1} />
        <p>{chapter.body[lang]}</p>
        {!page.example && (
          <a
            className="text-link"
            href="https://www.aethersystems.tech/en"
            target="_blank"
            rel="noreferrer"
          >
            {choose(
              lang,
              "Pôvodná prezentácia AETHER",
              "Original AETHER presentation",
            )}
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    );
  if (id === "engineering" || id === "delivery" || id === "connections")
    return <Related paths={page.related || ["/contact"]} lang={lang} />;
  return null;
}

function Outcomes({ lang }: { lang: Lang }) {
  const [filter, setFilter] = useState("all");
  const filtered = casePages.filter(
    (p) => filter === "all" || (filter === "projects" ? !p.example : p.example),
  );
  return (
    <>
      <div className="outcomes-heading section-pad">
        <h1>{choose(lang, "Výsledky.", "Outcomes.")}</h1>
        <p>
          {choose(lang, "Čo tvoríme.", "What we build.")}
          <span>{choose(lang, "Čo sa mení.", "What changes.")}</span>
        </p>
      </div>
      <div
        className="outcome-filters section-pad"
        aria-label={choose(lang, "Filtrovať projekty", "Filter projects")}
      >
        {[
          ["all", bi("Všetko", "All")],
          ["projects", bi("Projekty AETHER", "AETHER projects")],
          ["concepts", bi("Referenčné návrhy", "Reference designs")],
        ].map(([id, label]) => (
          <button
            key={id as string}
            className={filter === id ? "active" : ""}
            aria-pressed={filter === id}
            onClick={() => setFilter(id as string)}
          >
            {(label as Text)[lang]}
          </button>
        ))}
      </div>
      <div className="outcomes-grid">
        {filtered.map((p, i) => (
          <a
            key={p.path}
            className={`outcome-tile ${i === 0 ? "featured" : ""}`}
            href={p.path}
          >
            <div className="outcome-copy">
              <span className="eyebrow">{p.category[lang]}</span>
              <h2>
                {p.title[lang]}
                <br />
                {p.strong[lang]}
              </h2>
              <p>{p.intro[lang]}</p>
              <span className="text-link">
                {choose(lang, "Preskúmať riešenie", "Explore the solution")}
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="outcome-art" aria-hidden="true">
              <div className="art-branches">
                {(p.nodes || []).slice(0, 3).map((n, k) => (
                  <div key={n}>
                    <span className="art-column">
                      {Array.from({ length: 18 }, (_, j) => (
                        <i
                          key={j}
                          style={{ width: `${35 + ((j * 13 + k * 17) % 65)}%` }}
                        />
                      ))}
                    </span>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
              <div className="art-caption">
                <span>AETHER SYSTEMS</span>
                <span>{num(i)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

export default function PageContent({
  page,
  lang,
}: {
  page: Page | undefined;
  lang: Lang;
}) {
  const [active, setActive] = useState(page?.chapters[0]?.id || "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document.querySelectorAll(".chapter").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [page?.path]);
  if (!page)
    return (
      <section className="not-found section-pad">
        <span className="eyebrow">404 / AETHER SYSTEMS</span>
        <h1>
          {choose(lang, "Táto stránka tu nie je.", "This page is not here.")}
        </h1>
        <a href="/" className="button light">
          {choose(lang, "Späť na úvod", "Back to home")}
          <ArrowRight size={18} />
        </a>
      </section>
    );
  if (page.kind === "outcomes") return <Outcomes lang={lang} />;
  const next =
    page.kind === "case"
      ? casePages[(casePages.indexOf(page) + 1) % casePages.length]
      : pageByPath(page.related?.[0] || "/contact");
  return (
    <div className={`inner-page ${page.kind}-page`}>
      <section className="page-hero section-pad">
        <div className="section-kicker">
          <span className="eyebrow">{page.category[lang]}</span>
          <span className="kicker-line" />
        </div>
        <h1>
          <span>{page.title[lang]}</span>
          <strong>{page.strong[lang]}</strong>
        </h1>
        <p>{page.intro[lang]}</p>
        {page.example && (
          <span className="reference-badge">
            {choose(
              lang,
              "Referenčný návrh, nie realizovaná zákazka",
              "Reference design, not a delivered engagement",
            )}
          </span>
        )}
        <a
          href={`#${page.chapters[0]?.id}`}
          className="page-scroll icon-button"
          aria-label={choose(lang, "Preskúmať stránku", "Explore this page")}
        >
          <ArrowDown size={18} />
        </a>
      </section>
      <div className="page-layout section-pad">
        <div className="page-chapters">
          {page.chapters.map((chapter, i) => (
            <section className="chapter" id={chapter.id} key={chapter.id}>
              <div className="section-kicker">
                <span className="eyebrow">
                  {num(i)} / {page.category[lang].split("/")[0]}
                </span>
                <span className="kicker-line" />
              </div>
              <h2>{chapter.title[lang]}</h2>
              {chapter.id !== "outcomes" && (
                <p className="chapter-intro">{chapter.body[lang]}</p>
              )}
              <SectionBody chapter={chapter} page={page} lang={lang} />
            </section>
          ))}
        </div>
        <aside className="page-aside">
          <nav aria-label={choose(lang, "Na tejto stránke", "On this page")}>
            <span className="eyebrow">
              {choose(lang, "NA TEJTO STRÁNKE", "ON THIS PAGE")}
            </span>
            {page.chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={active === c.id ? "active" : ""}
                aria-current={active === c.id ? "location" : undefined}
              >
                <span>{num(i)}</span>
                {c.title[lang]}
              </a>
            ))}
          </nav>
        </aside>
      </div>
      {page.kind !== "legal" && (
        <div className="page-next section-pad">
          <div className="page-siblings">
            {(page.kind === "case"
              ? casePages
              : page.kind === "about" || page.kind === "careers"
                ? pages.filter((p) =>
                    ["outcomes", "about", "careers"].includes(p.kind),
                  )
                : servicePaths.map((p) => pageByPath(p)!)
            ).map((p, i) => (
              <a
                href={p.path}
                key={p.path}
                aria-current={p.path === page.path ? "page" : undefined}
              >
                <span className="eyebrow">{num(i)}</span>
                {p.title[lang]} {p.strong[lang]}
              </a>
            ))}
          </div>
          {next && (
            <a className="next-link" href={next.path}>
              <span className="eyebrow">{choose(lang, "ĎALEJ", "NEXT")}</span>
              <span>
                {next.title[lang]} {next.strong[lang]}
              </span>
              <ArrowUpRight size={32} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
