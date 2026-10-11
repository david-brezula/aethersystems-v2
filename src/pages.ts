export type Lang = "sk" | "en";
export type Text = { sk: string; en: string };
export const bi = (sk: string, en: string): Text => ({ sk, en });
export const servicePaths = [
  "/data-engineering",
  "/analytics",
  "/ai-engineering",
  "/migration",
  "/managed-services",
  "/business-platforms",
];
export type Chapter = { id: string; title: Text; body: Text; items?: Text[] };
export type Page = {
  path: string;
  kind:
    | "service"
    | "platform"
    | "migration"
    | "case"
    | "about"
    | "careers"
    | "contact"
    | "legal"
    | "outcomes";
  title: Text;
  strong: Text;
  intro: Text;
  category: Text;
  chapters: Chapter[];
  related?: string[];
  nodes?: string[];
  original?: string;
  example?: boolean;
};
const ch = (id: string, title: Text, body: Text, items?: Text[]): Chapter => ({
  id,
  title,
  body,
  items,
});
const delivery = ch(
  "delivery",
  bi("Od návrhu k odovzdaniu.", "From design to delivery."),
  bi(
    "Odovzdanie zahŕňa zdrojový kód, konfiguráciu, testy a podklady pre ďalší rozvoj. Technológie vyberáme podľa potrieb produktu, jeho používateľov a tímu, ktorý sa oň bude starať.",
    "Handover includes source code, configuration, tests and the foundations for further development. Technology follows the product, its users and the team that will operate it.",
  ),
);
const questions = ch(
  "questions",
  bi("Praktické otázky.", "The practical questions."),
  bi(
    "Každý projekt začína spresnením rozsahu. Tu sú témy, ktoré si prejdeme spolu.",
    "Every engagement starts with a clear scope. These are the questions we work through together.",
  ),
);
const serviceCategory = bi(
  "SLUŽBY / AETHER SYSTEMS",
  "SERVICES / AETHER SYSTEMS",
);
const platformCategory = bi(
  "PLATFORMY / TECHNICKÝ ZÁKLAD",
  "PLATFORMS / ENGINEERING FOUNDATION",
);

export const pages: Page[] = [
  {
    path: "/data-engineering",
    kind: "service",
    title: bi("MVP", "MVP"),
    strong: bi("Product Studio.", "Product Studio."),
    category: serviceCategory,
    intro: bi(
      "Premeníme overený nápad na použiteľný produkt. Discovery, dizajn a vývoj v jednom procese, s jasným rozsahom, pevnou cenou a priestorom pre ďalší rast.",
      "Turn a validated idea into a usable product. Discovery, design and development in one process, with a clear scope, fixed price and room to grow.",
    ),
    nodes: ["Discovery", "Design", "Build", "Launch", "Evolve"],
    chapters: [
      ch(
        "paradigm",
        bi("Nápad a realita.", "Idea and reality."),
        bi(
          "Veľká vízia často obsahuje priveľa funkcií a neoverených predpokladov. Spoločne vyberieme problém, ktorého riešenie má pre používateľa najväčšiu hodnotu.",
          "A big vision often contains too many features and untested assumptions. Together we identify the problem whose solution matters most to the user.",
        ),
      ),
      ch(
        "architecture",
        bi("Základ pre rast.", "Built for growth."),
        bi(
          "Používateľské rozhranie, aplikačná logika a dátová vrstva majú jasné hranice. Prvá verzia tak vytvára základ pre ďalšie iterácie.",
          "The interface, application logic and data layer have clear boundaries. The first release becomes a foundation for the next iterations.",
        ),
      ),
      ch(
        "streaming",
        bi("Od požiadavky k releasu.", "From requirement to release."),
        bi(
          "Práca postupuje v krátkych, kontrolovateľných krokoch. Funkcie priebežne overujeme a pripravujeme na reálne používanie.",
          "Work progresses in short, reviewable steps. Features are continuously validated and prepared for real use.",
        ),
      ),
      ch(
        "systems",
        bi("Jadro produktu.", "Core systems."),
        bi(
          "Sústredíme sa na to, čo odlišuje váš produkt. Opakovateľný technický základ zabezpečuje BaseVenture.",
          "We focus on what makes your product different. BaseVenture supplies a reusable technical foundation.",
        ),
        [
          bi("Používateľské účty", "User accounts"),
          bi("Doménová logika", "Domain logic"),
          bi("Dáta a integrácie", "Data and integrations"),
          bi("Testovanie a nasadenie", "Testing and deployment"),
        ],
      ),
      ch(
        "patterns",
        bi("Od nápadu k použitiu.", "Ideas in practice."),
        bi(
          "Zákaznícke portály, rezervačné systémy či interné pracovné nástroje majú rozdielne potreby. Rozsah definujeme podľa používateľov a obchodného modelu.",
          "Customer portals, scheduling systems and internal tools have different needs. Scope follows users and the business model.",
        ),
      ),
      delivery,
    ],
    related: [
      "/databricks-consulting",
      "/case-studies/healthcare-fabric-data-platform",
    ],
  },
  {
    path: "/ai-engineering",
    kind: "service",
    title: bi("AI &", "AI &"),
    strong: bi("Automation.", "Automation."),
    category: serviceCategory,
    intro: bi(
      "Inteligentné nástroje, ktoré zapadajú do vašich procesov. Prepájame jazykové modely, firemné informácie a aplikácie, aby váš tím získal viac času na dôležitú prácu.",
      "Intelligent tools that fit your processes. We connect language models, business information and applications to give your team more time for meaningful work.",
    ),
    nodes: ["Knowledge", "Context", "Model", "Tools", "Review"],
    chapters: [
      ch(
        "paradigm",
        bi("Od experimentu k praxi.", "From experiment to practice."),
        bi(
          "Samotné AI demo ešte nevyrieši pracovný proces. Začíname konkrétnou úlohou a overíme, kde automatizácia pomôže a kde má zostať človek.",
          "An AI demo alone does not solve a workflow. We start with a concrete task and establish where automation helps and where people remain essential.",
        ),
      ),
      ch(
        "foundry",
        bi("Inteligencia v procese.", "Intelligence in the workflow."),
        bi(
          "Najskôr správne informácie. Potom vhodný model a dostupné nástroje. Nakoniec kontrola výsledku.",
          "First, the right information. Then, an appropriate model and available tools. Finally, review of the result.",
        ),
        [
          bi("Práca s kontextom", "Working with context"),
          bi("Prepojenie nástrojov", "Connecting tools"),
          bi("Kontrola výsledkov", "Reviewing outcomes"),
        ],
      ),
      ch(
        "security",
        bi("Jasné hranice.", "Clear boundaries."),
        bi(
          "Prístupy k dátam, oprávnenia a kroky na schválenie sú súčasťou návrhu. Automatizácia má vykonávať len úlohy, ktoré jej tím zverí.",
          "Data access, permissions and approval steps are part of the design. Automation should perform only the tasks entrusted to it.",
        ),
      ),
      ch(
        "architecture",
        bi("Architektúra asistenta.", "The assistant architecture."),
        bi(
          "Firemné informácie a rozhrania prepájame s aplikáciou, ktorú váš tím používa. Výstupy musia byť zrozumiteľné a použiteľné v každodennej práci.",
          "Business information and interfaces connect to an application your team uses. Outputs must be understandable and useful in day-to-day work.",
        ),
      ),
      ch(
        "assistant",
        bi("Od otázky k odpovedi.", "From question to answer."),
        bi(
          "Ukážka tém, s ktorými môže pomôcť firemný asistent AETHER.",
          "Explore the topics an AETHER company assistant can help with.",
        ),
      ),
      delivery,
    ],
    related: [
      "/case-studies/governed-knowledge-agent",
      "/microsoft-data-ai-consulting",
    ],
  },
  {
    path: "/analytics",
    kind: "service",
    title: bi("Webové", "Web"),
    strong: bi("aplikácie.", "applications."),
    category: serviceCategory,
    intro: bi(
      "Webové aplikácie a PWA pre reálnu prácu. Prehľadné rozhrania, kvalitný technický základ a konzistentný zážitok na počítači aj mobile.",
      "Web applications and PWAs for real work. Clear interfaces, sound engineering and a consistent experience on desktop and mobile.",
    ),
    nodes: ["Users", "Interface", "API", "Data", "Insights"],
    chapters: [
      ch(
        "paradigm",
        bi("Od tabuliek k prehľadu.", "From spreadsheets to clarity."),
        bi(
          "Keď informácie žijú v nesúvisiacich tabuľkách, tím trávi čas ich spájaním. Vlastná aplikácia prináša dáta aj pracovný postup na jedno miesto.",
          "When information lives in disconnected spreadsheets, teams spend time piecing it together. A custom application brings data and workflow into one place.",
        ),
      ),
      ch(
        "insights",
        bi("Pracovný prehľad.", "Operational insights."),
        bi(
          "Prehľad má zodpovedať na konkrétne otázky tímu. Výber obdobia a filtrovanie majú okamžite meniť zobrazené údaje.",
          "A dashboard should answer the team’s concrete questions. Period selection and filtering should immediately update the displayed information.",
        ),
      ),
      ch(
        "mobile",
        bi("Rovnaký systém. Aj v pohybe.", "The same system. On the move."),
        bi(
          "PWA a responzívny dizajn sprístupňujú dôležité informácie aj mimo kancelárie. Rozhranie prispôsobujeme veľkosti obrazovky a pracovnej situácii.",
          "PWAs and responsive design make important information available beyond the office. We adapt the interface to screen size and working context.",
        ),
      ),
      ch(
        "reports",
        bi("Presnosť v každom detaile.", "Precision in every detail."),
        bi(
          "Detailné prehľady, exporty a zrozumiteľné stavy pomáhajú používateľom dokončiť prácu bez obchádzok.",
          "Detailed reports, exports and clear states help users finish their work without workarounds.",
        ),
      ),
      ch(
        "connections",
        bi("Prepojené nástroje.", "Connected tools."),
        bi(
          "Nová aplikácia nemusí nahradiť každý nástroj. Integrácie umožnia spoluprácu s existujúcimi systémami.",
          "A new application does not need to replace every tool. Integrations let it work with existing systems.",
        ),
      ),
      delivery,
    ],
    related: ["/case-studies/streaming-parcel-events", "/migration"],
  },
  {
    path: "/migration",
    kind: "migration",
    title: bi("Systémy", "Systems"),
    strong: bi("v pohybe.", "in transition."),
    category: serviceCategory,
    intro: bi(
      "Modernizujeme softvér a prepájame nástroje do jedného celku. S jasným plánom prechodu, overením dát a priestorom na ďalší rozvoj.",
      "Modernize software and connect tools into one ecosystem. With a clear transition plan, data validation and room for further development.",
    ),
    nodes: ["Discover", "Map", "Build", "Validate", "Release"],
    chapters: [
      ch(
        "tracks",
        bi("Tri cesty modernizácie.", "Three modernization tracks."),
        bi(
          "Vyberáme postup podľa východiskového systému a cieľa firmy.",
          "The approach follows your existing system and business objective.",
        ),
      ),
      ch(
        "gates",
        bi("Päť krokov. Každé prepojenie.", "Five gates. Every connection."),
        bi(
          "Od zmapovania existujúceho stavu po overenie výsledku. Rozhrania a závislosti kontrolujeme pred prechodom do prevádzky.",
          "From understanding the current estate to validating the result. Interfaces and dependencies are reviewed before production.",
        ),
      ),
    ],
    related: [
      "/migration-to-databricks",
      "/migration-to-fabric",
      "/ssrs-to-power-bi-migration",
    ],
  },
  {
    path: "/managed-services",
    kind: "service",
    title: bi("Scaling &", "Scaling &"),
    strong: bi("Evolution.", "Evolution."),
    category: serviceCategory,
    intro: bi(
      "Spustením produktu sa spolupráca nekončí. Rozvíjame funkcie, zlepšujeme výkon a udržiavame softvér pripravený na ďalšie potreby firmy.",
      "Launching a product is the beginning. We develop features, improve performance and keep software ready for your company’s next stage.",
    ),
    nodes: ["Observe", "Prioritize", "Improve", "Test", "Deploy"],
    chapters: [
      ch(
        "paradigm",
        bi("Od reakcií k plánu.", "From reaction to a roadmap."),
        bi(
          "Namiesto izolovaných úprav vytvárame plán rozvoja podľa priorít používateľov a firmy. Údržba a nové funkcie majú svoje miesto v rovnakom procese.",
          "Build a development plan around user and business priorities. Maintenance and new features both belong in the same process.",
        ),
      ),
      ch(
        "control",
        bi("Mission Control.", "Mission Control."),
        bi(
          "Viditeľný stav aplikácie, prehľad priorít a kontrolované nasadzovanie vytvárajú základ dlhodobej spolupráce.",
          "Application visibility, clear priorities and controlled releases form the foundation of long-term collaboration.",
        ),
        [
          bi("Prevádzkový prehľad", "Operational visibility"),
          bi("Výkon a stabilita", "Performance and stability"),
          bi("Rozvoj produktu", "Product evolution"),
          bi("Údržba a podpora", "Maintenance and support"),
        ],
      ),
    ],
    related: ["/case-studies/synapse-to-databricks-migration", "/contact"],
  },
  {
    path: "/business-platforms",
    kind: "service",
    title: bi("Business", "Business"),
    strong: bi("Platforms.", "Platforms."),
    category: serviceCategory,
    intro: bi(
      "Keď štandardný nástroj nestačí, vzniká priestor pre vlastný systém. Navrhujeme platformy okolo vášho tímu, procesov a obchodného modelu.",
      "When a standard tool falls short, there is room for a custom system. We design platforms around your team, processes and business model.",
    ),
    nodes: ["Team", "Workspace", "Services", "Integrations", "Platform"],
    chapters: [
      ch(
        "paradigm",
        bi("Váš spôsob práce.", "Your way of working."),
        bi(
          "Softvér sa má prispôsobiť procesu, ktorý dáva vášmu biznisu zmysel. Spoločne odlíšime skutočné potreby od zbytočnej komplexity.",
          "Software should fit the process that makes sense for your business. Together we distinguish real needs from unnecessary complexity.",
        ),
      ),
      ch(
        "architecture",
        bi("Jedna platforma.", "One platform."),
        bi(
          "Používateľské role, pracovné postupy a integrácie tvoria jeden prepojený systém.",
          "User roles, workflows and integrations form one connected system.",
        ),
      ),
      delivery,
    ],
    related: [
      "/databricks-consulting",
      "/case-studies/pricing-desk-databricks-app",
    ],
  },
];

const platformPages: Page[] = [
  {
    path: "/databricks-consulting",
    kind: "platform",
    title: bi("Base", "Base"),
    strong: bi("Venture.", "Venture."),
    category: platformCategory,
    intro: bi(
      "Náš interný vývojový základ pre nové produkty. Pripravená infraštruktúra uvoľňuje čas pre logiku a zážitok, ktoré odlišujú váš produkt.",
      "Our internal development foundation for new products. Ready infrastructure frees time for the logic and experience that make your product unique.",
    ),
    nodes: ["Identity", "Payments", "Email", "Delivery", "Your product"],
    chapters: [
      ch(
        "foundation",
        bi("Základ, na ktorom sa dá stavať.", "A foundation to build on."),
        bi(
          "Autentifikácia, platby, e-mail a CI/CD sa opakujú v mnohých projektoch. BaseVenture ich spája do modulárneho základu.",
          "Authentication, payments, email and CI/CD recur across projects. BaseVenture brings them into a modular foundation.",
        ),
      ),
      ch(
        "architecture",
        bi("Od základu k produktu.", "From foundation to product."),
        bi(
          "Každý modul má vlastnú úlohu. Váš produkt pridáva doménovú logiku, pracovné postupy a používateľské rozhranie.",
          "Each module has a defined role. Your product adds domain logic, workflows and its user interface.",
        ),
      ),
      delivery,
      ch(
        "engineering",
        bi("Pozrite sa pod povrch.", "See the engineering."),
        bi(
          "Typovaný kód, izolované komponenty a automatizované nasadzovanie podporujú dlhodobý rozvoj.",
          "Typed code, isolated components and automated deployment support long-term evolution.",
        ),
      ),
      questions,
    ],
    related: [
      "/case-studies/databricks-multi-source-delivery",
      "/data-engineering",
    ],
  },
  {
    path: "/microsoft-data-ai-consulting",
    kind: "platform",
    title: bi("Cloud &", "Cloud &"),
    strong: bi("AI systémy.", "AI systems."),
    category: platformCategory,
    intro: bi(
      "Prepojený technický základ pre webové aplikácie, firemné nástroje a inteligentnú automatizáciu. Architektúra navrhnutá podľa reálneho použitia.",
      "A connected technical foundation for web apps, business tools and intelligent automation. Architecture designed around real use.",
    ),
    nodes: ["Web / PWA", "APIs", "Cloud", "Data", "AI"],
    chapters: [
      ch(
        "foundation",
        bi("Prepojený základ.", "A connected foundation."),
        bi(
          "Aplikácie, dáta a automatizácie fungujú najlepšie ako súčasť premysleného celku.",
          "Applications, data and automation work best as part of a coherent whole.",
        ),
      ),
      ch(
        "architecture",
        bi(
          "Cloudové aplikácie. Praktická AI.",
          "Cloud applications. Practical AI.",
        ),
        bi(
          "Oddelené služby, definované API a kontrola prístupov umožňujú rozvíjať jednotlivé časti systému podľa potreby.",
          "Separate services, defined APIs and access controls let individual parts evolve as needed.",
        ),
      ),
      delivery,
      ch(
        "engineering",
        bi("Od procesu k systému.", "From workflow to system."),
        bi(
          "Výber technológií nadväzuje na existujúce nástroje a potreby tímu. Cieľom je použiteľný, udržiavateľný produkt.",
          "Technology selection follows existing tools and team needs. The goal is a usable, maintainable product.",
        ),
      ),
      questions,
    ],
    related: ["/ai-engineering", "/case-studies/governed-knowledge-agent"],
  },
];
pages.push(...platformPages);

const migrationDetails = [
  {
    path: "/migration-to-databricks",
    title: bi("Modernizácia", "Software"),
    strong: bi("softvéru.", "modernization."),
    intro: bi(
      "Staršie systémy nemusia obmedzovať ďalší rast. Zmapujeme závislosti, navrhneme cieľovú architektúru a rozdelíme prechod na overiteľné etapy.",
      "Legacy systems do not have to limit growth. Map dependencies, design the target architecture and divide the transition into verifiable stages.",
    ),
    target: bi("Udržiavateľný produkt", "Maintainable product"),
    nodes: ["Legacy", "Interfaces", "New services", "Validation", "Release"],
  },
  {
    path: "/migration-to-fabric",
    title: bi("Prepojené", "Connected"),
    strong: bi("systémy.", "systems."),
    intro: bi(
      "CRM, ERP, účtovníctvo a vlastné aplikácie v jednom ekosystéme. Odstraňujeme ručné prenášanie údajov medzi nástrojmi.",
      "CRM, ERP, accounting and custom applications in one ecosystem. Remove manual data transfers between tools.",
    ),
    target: bi("Jeden dátový tok", "One data flow"),
    nodes: ["CRM", "Integration API", "ERP", "Accounting", "Operations"],
  },
  {
    path: "/ssrs-to-power-bi-migration",
    title: bi("Procesy,", "Workflows,"),
    strong: bi("nanovo.", "re-engineered."),
    intro: bi(
      "Premieňame opakované manuálne úlohy na zrozumiteľné pracovné postupy. Najprv proces pochopíme, potom navrhneme automatizáciu.",
      "Turn repetitive manual tasks into clear workflows. First understand the process, then design its automation.",
    ),
    target: bi("Kontrolovaná automatizácia", "Controlled automation"),
    nodes: ["Input", "Rules", "Automation", "Review", "Result"],
  },
];
pages.push(
  ...migrationDetails.map((p) => ({
    ...p,
    kind: "migration" as const,
    category: bi(
      "MODERNIZÁCIA / DETAIL SLUŽBY",
      "MODERNIZATION / SERVICE DETAIL",
    ),
    chapters: [
      ch(
        "paradigm",
        bi("Dnešný stav a ďalší krok.", "Today’s system and the next step."),
        p.intro,
      ),
      ch(
        "architecture",
        p.target,
        bi(
          "Zachováme potrebné väzby a jasne definujeme nové rozhrania. Overenie vstupov aj výsledkov je súčasťou každého kroku.",
          "Preserve required connections and clearly define new interfaces. Validate inputs and outputs at every step.",
        ),
      ),
      ch(
        "workloads",
        bi("Čo sa mení. Čo zostáva.", "What changes. What stays."),
        bi(
          "S používateľmi identifikujeme časti, ktoré už fungujú, aj miesta s najväčším potenciálom zlepšenia. Nové riešenie overujeme na reprezentatívnych scenároch.",
          "Work with users to identify what already works and where improvement matters most. Validate the new solution against representative scenarios.",
        ),
      ),
      ch(
        "gates",
        bi("Kontrola každého rozhodnutia.", "Inspect every decision."),
        bi(
          "Mapovanie, návrh, implementácia, overenie a odovzdanie tvoria jednu nadväzujúcu cestu.",
          "Mapping, design, implementation, validation and handover form one connected path.",
        ),
      ),
      questions,
    ],
    related: ["/migration", "/contact"],
  })),
);

const cases = [
  {
    path: "databricks-multi-source-delivery",
    title: bi("BaseVenture.", "BaseVenture."),
    strong: bi("Pripravený základ.", "Ready to build."),
    category: bi("INTERNÝ PRODUKT / VÝVOJ", "INTERNAL PRODUCT / DEVELOPMENT"),
    intro: bi(
      "Opakovaný začiatok projektu nahrádza modulárny základ. BaseVenture spája autentifikáciu, platby, e-mail a nasadzovanie, aby zostal priestor pre vlastný produkt.",
      "A modular foundation replaces repetitive project setup. BaseVenture combines authentication, payments, email and deployment to leave room for the product itself.",
    ),
    nodes: ["Identity", "Payments", "Email", "CI / CD", "Product"],
    example: false,
  },
  {
    path: "healthcare-fabric-data-platform",
    title: bi("SmartMed", "SmartMed"),
    strong: bi("Scheduler.", "Scheduler."),
    category: bi("ZDRAVOTNÍCTVO / AI PLATFORMA", "HEALTHCARE / AI PLATFORM"),
    intro: bi(
      "Plánovanie termínov s prediktívnou AI. Prípadová štúdia AETHER opisuje platformu, ktorá pomáha predvídať neúčasť pacientov a obsadzovať uvoľnené termíny.",
      "Appointment scheduling with predictive AI. AETHER’s case study describes a platform that helps predict patient no-shows and fill available appointments.",
    ),
    nodes: [
      "Appointments",
      "Events",
      "Prediction",
      "Scheduling",
      "Notifications",
    ],
    example: false,
  },
  {
    path: "lakehouse-plant-telemetry",
    title: bi("Prevádzka.", "Operations."),
    strong: bi("V jednom obraze.", "One clear view."),
    category: bi(
      "REFERENČNÝ NÁVRH / PREVÁDZKA",
      "REFERENCE DESIGN / OPERATIONS",
    ),
    intro: bi(
      "Návrh aplikácie pre prehľad prevádzkových udalostí. Ukazuje, ako môžu integrácie spojiť informácie z viacerých zdrojov do jedného pracovného priestoru.",
      "An application concept for operational events. It shows how integrations can combine information from several sources into one workspace.",
    ),
    nodes: ["Sources", "Events", "Validation", "Workspace", "Alerts"],
    example: true,
  },
  {
    path: "streaming-parcel-events",
    title: bi("Cargo", "Cargo"),
    strong: bi("Track.", "Track."),
    category: bi("LOGISTIKA / PWA & IOT", "LOGISTICS / PWA & IOT"),
    intro: bi(
      "Od telefónov a tabuliek k prehľadu flotily. CargoTrack spája cloudovú PWA s IoT dátami, sledovaním vozidiel a podporou práce pri výpadku pripojenia.",
      "From phone calls and spreadsheets to fleet visibility. CargoTrack combines a cloud PWA with IoT data, vehicle tracking and support for work without connectivity.",
    ),
    nodes: ["Vehicles", "IoT events", "Cloud API", "Fleet PWA", "Dispatch"],
    example: false,
  },
  {
    path: "synapse-to-databricks-migration",
    title: bi("Starší systém.", "Legacy system."),
    strong: bi("Nový základ.", "New foundation."),
    category: bi(
      "REFERENČNÝ NÁVRH / MODERNIZÁCIA",
      "REFERENCE DESIGN / MODERNIZATION",
    ),
    intro: bi(
      "Postupná obnova existujúcej aplikácie. Referenčný návrh ukazuje oddelenie rozhraní, nahrádzanie modulov a priebežné overovanie výsledkov.",
      "Gradual renewal of an existing application. This reference design shows interface separation, module replacement and continuous validation.",
    ),
    nodes: ["Legacy", "API boundary", "New modules", "Validation", "Release"],
    example: true,
  },
  {
    path: "governed-knowledge-agent",
    title: bi("Firemné znalosti.", "Company knowledge."),
    strong: bi("Dostupné tímu.", "Within reach."),
    category: bi(
      "REFERENČNÝ NÁVRH / AI ASISTENT",
      "REFERENCE DESIGN / AI ASSISTANT",
    ),
    intro: bi(
      "Koncept asistenta nad schválenými firemnými podkladmi. Otázka vedie k relevantnému kontextu a odpovedi, ktorú môže používateľ overiť.",
      "An assistant concept built around approved company material. A question leads to relevant context and an answer the user can verify.",
    ),
    nodes: ["Documents", "Permissions", "Retrieval", "Model", "Sources"],
    example: true,
  },
  {
    path: "pricing-desk-databricks-app",
    title: bi("Rozhodnutia.", "Decisions."),
    strong: bi("V jednej aplikácii.", "In one application."),
    category: bi(
      "REFERENČNÝ NÁVRH / FIREMNÝ PORTÁL",
      "REFERENCE DESIGN / BUSINESS PORTAL",
    ),
    intro: bi(
      "Pracovný priestor pre dáta, návrhy a schvaľovanie. Koncept vlastnej webovej aplikácie nahrádza posielanie rôznych verzií tabuliek medzi tímami.",
      "A workspace for data, proposals and approvals. This custom web application concept replaces emailing different spreadsheet versions between teams.",
    ),
    nodes: ["Business data", "API", "Workspace", "Approval", "History"],
    example: true,
  },
  {
    path: "metadata-driven-ingestion-framework",
    title: bi("Integrácie.", "Integrations."),
    strong: bi("Jeden systém.", "One system."),
    category: bi(
      "REFERENČNÝ NÁVRH / SYSTÉMOVÉ API",
      "REFERENCE DESIGN / SYSTEM APIs",
    ),
    intro: bi(
      "Spoločné rozhranie pre CRM, ERP a účtovníctvo. Referenčný návrh definuje zdroje, mapovanie údajov a kontrolu synchronizácie.",
      "A shared interface for CRM, ERP and accounting. This reference design defines sources, data mapping and synchronization checks.",
    ),
    nodes: ["CRM / ERP", "Connectors", "Mapping", "Validation", "Applications"],
    example: true,
  },
];
pages.push(
  ...cases.map((p) => ({
    ...p,
    path: `/case-studies/${p.path}`,
    kind: "case" as const,
    chapters: [
      ch("situation", bi("Predtým a potom.", "Before and after."), p.intro),
      ch(
        "platform",
        bi("Architektúra riešenia.", "The platform."),
        bi(
          "Prehľad hlavných častí a ich nadväzností. Každá vrstva má vlastnú zodpovednosť a jasné rozhranie.",
          "An overview of the main components and their connections. Each layer has a defined responsibility and a clear interface.",
        ),
      ),
      ch(
        "delivery",
        bi("Vnútri riešenia.", "Inside the delivery."),
        bi(
          "Začíname pochopením pracovného postupu. Návrh rozdelíme na menšie časti a overujeme ich na konkrétnych scenároch.",
          "Start by understanding the workflow. Divide the design into smaller parts and validate them against concrete scenarios.",
        ),
        [
          bi("Zmapovanie požiadaviek", "Requirements discovery"),
          bi("Návrh dát a rozhraní", "Data and interface design"),
          bi("Implementácia a testovanie", "Implementation and testing"),
          bi("Odovzdanie a ďalší rozvoj", "Handover and evolution"),
        ],
      ),
      ch(
        "outcomes",
        p.example
          ? bi("Čo návrh umožňuje.", "What the design enables.")
          : bi("Čo sa zmenilo.", "What changed."),
        p.example
          ? bi(
              "Prepojené informácie, zrozumiteľná zodpovednosť a priestor pre ďalší rozvoj. Konkrétny výsledok závisí od rozsahu a podmienok implementácie.",
              "Connected information, clear ownership and room for further development. Actual results depend on implementation scope and conditions.",
            )
          : p.path === "databricks-multi-source-delivery"
            ? bi(
                "Znovupoužiteľný základ presúva pozornosť od opakovanej infraštruktúry k vlastnej logike produktu.",
                "A reusable foundation shifts attention from repeated infrastructure work to the product’s own logic.",
              )
            : p.path === "healthcare-fabric-data-platform"
              ? bi(
                  "Podľa prípadovej štúdie na aethersystems.tech riešenie znížilo neúčasť pacientov o 40 % a bolo nasadené za osem týždňov.",
                  "According to the case study on aethersystems.tech, the solution reduced patient no-shows by 40% and was deployed in eight weeks.",
                )
              : bi(
                  "Podľa prípadovej štúdie na aethersystems.tech bola platforma nasadená za desať týždňov a rozšírila sa na viac než 120 vozidiel.",
                  "According to the case study on aethersystems.tech, the platform was deployed in ten weeks and grew to more than 120 vehicles.",
                ),
      ),
    ],
    related: ["/case-studies", "/contact"],
  })),
);

pages.push(
  {
    path: "/case-studies",
    kind: "outcomes",
    title: bi("Výsledky.", "Outcomes."),
    strong: bi("", ""),
    category: bi("PROJEKTY & NÁVRHY", "PROJECTS & DESIGNS"),
    intro: bi("Čo tvoríme. Čo sa mení.", "What we build. What changes."),
    chapters: [],
  },
  {
    path: "/about",
    kind: "about",
    title: bi("AETHER", "AETHER"),
    strong: bi("Systems.", "Systems."),
    category: bi("FIRMA", "COMPANY"),
    intro: bi(
      "Meníme komplexné výzvy na zrozumiteľné systémy. Spájame obchodný pohľad, dizajn a vývoj softvéru, aby technológie podporovali rast vašej firmy.",
      "Turning complex challenges into clear systems. We bring business thinking, design and software engineering together so technology supports your company’s growth.",
    ),
    chapters: [
      ch(
        "principles",
        bi("Ako pracujeme.", "How we work."),
        bi(
          "Za každým systémom je konkrétny problém, používateľ a obchodný cieľ.",
          "Behind every system is a concrete problem, a user and a business objective.",
        ),
        [
          bi("Stratégia pred implementáciou", "Strategy before implementation"),
          bi("Jasný rozsah spolupráce", "A clear scope"),
          bi(
            "Vývoj s priebežným overovaním",
            "Development with continuous validation",
          ),
          bi("Partnerstvo po spustení", "Partnership after launch"),
        ],
      ),
      ch(
        "mission",
        bi("Zmysel a smer.", "Mission & vision."),
        bi(
          "Vaša vízia. Náš systém. Budujeme softvér, ktorý pomáha firme fungovať lepšie a vytvára priestor na ďalší rozvoj.",
          "Your vision. Our system. We build software that helps a company operate better and creates room for its next chapter.",
        ),
        [
          bi("Biznis na prvom mieste", "Business first"),
          bi("Zrozumiteľné riešenia", "Clear solutions"),
          bi("Udržateľný rast", "Sustainable growth"),
        ],
      ),
      ch(
        "core",
        bi("Naše jadro.", "The core."),
        bi(
          "Od MVP cez webové aplikácie až po automatizáciu a systémové integrácie.",
          "From MVPs and web applications to automation and system integrations.",
        ),
      ),
    ],
    related: ["/careers", "/case-studies"],
  },
  {
    path: "/careers",
    kind: "careers",
    title: bi("Tvorme", "Build"),
    strong: bi("spolu.", "with us."),
    category: bi("SPOLUPRÁCA", "COLLABORATION"),
    intro: bi(
      "Zaujíma vás tvorba užitočného softvéru? Spoznajme sa. Povedzte nám, čomu sa venujete a aké problémy chcete riešiť.",
      "Interested in building useful software? Let’s get to know each other. Tell us what you do and the problems you want to solve.",
    ),
    chapters: [
      ch(
        "areas",
        bi("Kde sa môžete nájsť.", "Where you fit in."),
        bi(
          "Oblasti, na ktorých stojí tvorba našich produktov.",
          "The disciplines behind our products.",
        ),
        [
          bi("Vývoj webových aplikácií", "Web application development"),
          bi("AI a automatizácia", "AI and automation"),
          bi("Produktový dizajn", "Product design"),
          bi("Architektúra a integrácie", "Architecture and integrations"),
        ],
      ),
      ch(
        "principles",
        bi("Ako premýšľame.", "How we think."),
        bi(
          "Technické rozhodnutia prepájame s tým, čo potrebuje používateľ a biznis.",
          "We connect technical decisions to user and business needs.",
        ),
        [
          bi("Porozumieť problému", "Understand the problem"),
          bi("Vytvárať udržiavateľné riešenia", "Build maintainable solutions"),
          bi("Učiť sa a zdieľať kontext", "Learn and share context"),
        ],
      ),
      ch(
        "collaboration",
        bi("Priestor na rozhovor.", "Room for a conversation."),
        bi(
          "Konkrétnu rolu, formu spolupráce a podmienky si prejdeme individuálne. Táto stránka nie je zoznamom potvrdených otvorených pracovných pozícií.",
          "We discuss the role, collaboration model and terms individually. This page is not a list of confirmed open positions.",
        ),
      ),
      ch(
        "apply",
        bi("Ukážte nám svoju prácu.", "Share your work."),
        bi(
          "Pošlite nám odkaz na portfólio, GitHub alebo krátke predstavenie.",
          "Send us your portfolio, GitHub profile or a short introduction.",
        ),
      ),
    ],
    related: ["/about", "/contact"],
  },
  {
    path: "/contact",
    kind: "contact",
    title: bi("Začnime", "Start a"),
    strong: bi("rozhovor.", "conversation."),
    category: bi("KONTAKT", "CONTACT"),
    intro: bi(
      "Povedzte nám o svojom nápade, existujúcich systémoch a výsledku, ktorý potrebujete. Spoločne nájdeme praktický ďalší krok.",
      "Tell us about your idea, existing systems and the outcome you need. Together we will find a practical next step.",
    ),
    chapters: [
      ch(
        "process",
        bi("Ako sa začína projekt.", "How a project starts."),
        bi(
          "Od prvého rozhovoru po spustenie a ďalší rozvoj.",
          "From the first conversation to launch and ongoing development.",
        ),
        [
          bi("Úvodný rozhovor", "Initial conversation"),
          bi("Discovery workshop", "Discovery workshop"),
          bi("Overenie konceptu", "Concept validation"),
          bi("Dizajn a architektúra", "Design and architecture"),
          bi("Vývoj a integrácia", "Development and integration"),
          bi("Testovanie a spustenie", "Testing and launch"),
          bi("Rozvoj a podpora", "Evolution and support"),
        ],
      ),
      ch(
        "brief",
        bi("Váš projekt.", "The brief."),
        bi(
          "Pár viet o vašom cieli je dobrý začiatok.",
          "A few words about your goal are a great start.",
        ),
      ),
    ],
    related: ["/case-studies"],
  },
  {
    path: "/privacy",
    kind: "legal",
    title: bi("Vaše", "Your"),
    strong: bi("súkromie.", "privacy."),
    category: bi("INFORMÁCIE O WEBE", "WEBSITE INFORMATION"),
    intro: bi(
      "Ako tento web pracuje s údajmi, ktoré mu poskytnete.",
      "How this website handles the information you provide.",
    ),
    chapters: [
      ch(
        "contact-data",
        bi("01 / Kontaktné údaje", "01 / Contact information"),
        bi(
          "Formulár pripraví správu vo vašom e-mailovom klientovi. Údaje sa z tejto stránky neposielajú na formulárový server. Správu odošlete až vo svojom e-mailovom klientovi na info@aethersystems.tech.",
          "The form prepares a message in your email client. This page does not send the fields to a form server. You send the message from your email client to info@aethersystems.tech.",
        ),
      ),
      ch(
        "storage",
        bi("02 / Ukladanie v prehliadači", "02 / Browser storage"),
        bi(
          "Vo vašom prehliadači sa ukladá vybraný jazyk pod kľúčom aether-language. Nastavenie môžete odstrániť vymazaním údajov stránky. Web neobsahuje reklamné sledovanie ani analytické skripty.",
          "Your selected language is stored in your browser under aether-language. You can remove it by clearing site data. This website contains no advertising tracking or analytics scripts.",
        ),
      ),
      ch(
        "hosting",
        bi("03 / Technická prevádzka", "03 / Technical operation"),
        bi(
          "Pri načítaní webu poskytovateľ hostingu spracúva sieťové požiadavky potrebné na doručenie stránky. Tento web sám nevytvára používateľské účty ani databázu návštevníkov.",
          "When the website loads, its hosting provider processes the network requests needed to deliver the page. The site itself does not create user accounts or a visitor database.",
        ),
      ),
      ch(
        "choices",
        bi("04 / Vaše otázky", "04 / Your questions"),
        bi(
          "Otázky o údajoch alebo žiadosti súvisiace s vašou komunikáciou adresujte na info@aethersystems.tech.",
          "For questions about data or requests concerning your correspondence, contact info@aethersystems.tech.",
        ),
      ),
    ],
  },
  {
    path: "/terms",
    kind: "legal",
    title: bi("Používanie", "Website"),
    strong: bi("webu.", "terms."),
    category: bi("INFORMÁCIE O WEBE", "WEBSITE INFORMATION"),
    intro: bi(
      "Informácie o obsahu a používaní webovej prezentácie AETHER Systems.",
      "Information about the content and use of the AETHER Systems website.",
    ),
    chapters: [
      ch(
        "content",
        bi("01 / Obsah webu", "01 / Website content"),
        bi(
          "Web predstavuje služby a prístup AETHER Systems. Konkrétny rozsah, cenu, termíny a podmienky spolupráce určujeme samostatnou dohodou.",
          "This website presents AETHER Systems services and approach. Specific scope, pricing, timelines and engagement terms are established in a separate agreement.",
        ),
      ),
      ch(
        "examples",
        bi("02 / Projekty a ukážky", "02 / Projects and examples"),
        bi(
          "Referenčné návrhy a modelové údaje sú označené. Slúžia na vysvetlenie riešení a nepredstavujú tvrdenie o realizovanej zákazke alebo záruku budúceho výsledku.",
          "Reference designs and sample data are labelled. They explain solutions and do not claim a completed client engagement or guarantee a future result.",
        ),
      ),
      ch(
        "external",
        bi("03 / Externé služby", "03 / External services"),
        bi(
          "Odkazy mimo webu vedú na služby ich príslušných prevádzkovateľov. Odoslanie e-mailu prebieha vo vašom zvolenom e-mailovom klientovi.",
          "External links lead to services operated by their respective providers. Sending email takes place in your chosen email client.",
        ),
      ),
      ch(
        "inquiries",
        bi("04 / Kontakt", "04 / Contact"),
        bi(
          "Otázky k webu a návrhy na opravu obsahu môžete poslať na info@aethersystems.tech.",
          "Send website questions or content corrections to info@aethersystems.tech.",
        ),
      ),
    ],
  },
);

export const pageByPath = (path: string) =>
  pages.find((page) => page.path === path.replace(/\/$/, ""));
export const casePages = pages.filter((page) => page.kind === "case");
