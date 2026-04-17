import "./App.css";
import ankodeLogo from "./assets/ankode-logo.png";

const CONTACT = {
  whatsapp: "525512345678",
  email: "contacto@ankode.mx",
  phone: "+52 55 1234 5678",
};

const cleanWhatsAppNumber = CONTACT.whatsapp.replace(/\D/g, "");
const cleanPhoneNumber = CONTACT.phone.replace(/[^\d+]/g, "");

const buildWhatsAppLink = (message) =>
  `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(message)}`;

const buildMailtoLink = (subject, body) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const demoLink = buildWhatsAppLink("Hola, quiero solicitar una demo de ankode.");
const contactEmailLink = buildMailtoLink(
  "Quiero informacion de ankode",
  "Hola, me gustaria recibir informacion sobre ankode y agendar una demo."
);
const phoneLink = `tel:${cleanPhoneNumber}`;

const moduleCards = [
  { title: "Ventas", icon: "sales" },
  { title: "Inventario", icon: "inventory" },
  { title: "Proveedores", icon: "suppliers" },
  { title: "Credito y cobranza", icon: "credit" },
  { title: "Finanzas basicas", icon: "finance" },
  { title: "Recordatorios", icon: "reminders" },
  { title: "Soporte remoto", icon: "support" },
  { title: "Roles y accesos", icon: "access" },
];

const industries = [
  {
    id: "veterinaria",
    title: "Veterinaria",
    desc: "Organiza ventas, productos y operacion diaria con una base flexible para crecer segun tu forma de trabajar.",
    details:
      "Control de inventario clinico, seguimiento de productos y operacion diaria en un mismo flujo.",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para veterinaria",
  },
  {
    id: "retail",
    title: "Retail",
    desc: "Controla inventario, proveedores y ventas en tienda con mas claridad y menos errores.",
    details:
      "Inventario, reposicion y ventas centralizadas para mantener orden operativo y mejor visibilidad.",
    image:
      "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para retail",
  },
  {
    id: "restaurantes",
    title: "Restaurantes",
    desc: "Centraliza venta, control interno y operacion diaria para trabajar con mayor orden.",
    details:
      "Flujos para venta y control operativo en un solo sistema adaptable al ritmo del negocio.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para restaurante",
  },
  {
    id: "farmacias",
    title: "Farmacias",
    desc: "Ordena inventario, ventas y compras para evitar faltantes y operar con mejor control.",
    details:
      "Seguimiento de inventario y ventas con una vista clara para tomar decisiones mas rapidas.",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para farmacia",
  },
  {
    id: "consultorios",
    title: "Consultorios",
    desc: "Organiza cobros, seguimiento y operacion administrativa en un flujo simple.",
    details:
      "Estructura de trabajo para ordenar tareas internas y simplificar la operacion diaria.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para consultorio",
  },
];

const benefits = [
  {
    title: "Mas control",
    text: "Ten una vision mas clara de ventas, inventario y operacion sin depender de procesos manuales.",
  },
  {
    title: "Mas orden",
    text: "Centraliza tareas clave en un solo sistema y reduce la dispersion entre herramientas.",
  },
  {
    title: "Mas adaptacion",
    text: "Si tu negocio necesita algo distinto, ankode puede ajustarse a tu operacion real.",
  },
];

const steps = [
  "Conocemos tu operacion",
  "Revisamos lo que necesitas controlar",
  "Configuramos una propuesta acorde a tu negocio",
  "Te acompanamos en la implementacion",
];

const faqs = [
  {
    q: "¿Sirve para cualquier negocio?",
    a: "Esta pensado para adaptarse a distintos giros, especialmente veterinaria y retail.",
  },
  {
    q: "¿Es dificil de usar?",
    a: "No. La idea es que sea practico y claro para la operacion diaria.",
  },
  {
    q: "¿Ya esta listo para restaurantes?",
    a: "Si, puede configurarse para la operacion de este giro.",
  },
  {
    q: "¿Se puede ajustar a mi proceso?",
    a: "Si. Esa es una de las ideas principales detras de ankode.",
  },
];

function ModuleIcon({ name }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "sales":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...stroke} d="M4 7h16" />
          <path {...stroke} d="M7 7V5h10v2" />
          <rect {...stroke} x="5" y="7" width="14" height="12" rx="2" />
          <path {...stroke} d="M10 12h4" />
        </svg>
      );
    case "inventory":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...stroke} d="M3 7 12 3l9 4-9 4-9-4Z" />
          <path {...stroke} d="M3 12l9 4 9-4" />
          <path {...stroke} d="M3 17l9 4 9-4" />
        </svg>
      );
    case "suppliers":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...stroke} cx="8" cy="8" r="3" />
          <circle {...stroke} cx="16" cy="8" r="3" />
          <path {...stroke} d="M3 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
          <path {...stroke} d="M11 11h2" />
        </svg>
      );
    case "credit":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...stroke} x="3" y="6" width="18" height="12" rx="2" />
          <path {...stroke} d="M3 10h18" />
          <path {...stroke} d="M7 14h4" />
        </svg>
      );
    case "finance":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...stroke} d="M4 19h16" />
          <path {...stroke} d="M7 15V9" />
          <path {...stroke} d="M12 15V5" />
          <path {...stroke} d="M17 15v-3" />
        </svg>
      );
    case "reminders":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...stroke} d="M7 9a5 5 0 0 1 10 0v4l2 2H5l2-2Z" />
          <path {...stroke} d="M10 18a2 2 0 0 0 4 0" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...stroke} d="M4 12a8 8 0 1 1 16 0" />
          <rect {...stroke} x="3" y="12" width="4" height="6" rx="1" />
          <rect {...stroke} x="17" y="12" width="4" height="6" rx="1" />
          <path {...stroke} d="M12 20h3" />
        </svg>
      );
    case "access":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...stroke} x="4" y="11" width="16" height="9" rx="2" />
          <path {...stroke} d="M8 11V8a4 4 0 0 1 8 0v3" />
          <circle {...stroke} cx="12" cy="15" r="1" />
        </svg>
      );
    default:
      return null;
  }
}

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand brand-real">
          <img src={ankodeLogo} alt="ankode" className="brand-logo" />
        </div>

        <nav className="topnav">
          <a href="#modulos">Modulos</a>
          <a href="#giros">Por giro</a>
          <a href="#personalizacion">Personalizacion</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="topbar-actions">
          <a href={demoLink} className="btn btn-secondary" target="_blank" rel="noreferrer">
            Solicitar demo
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">POS adaptable para negocios reales</p>
            <h1>
              Controla tu negocio desde <span className="highlight">un solo sistema</span>
            </h1>
            <p className="hero-text">
              Ventas, inventario, proveedores y operacion diaria en una solucion
              pensada para la realidad de tu negocio.
            </p>

            <div className="hero-actions">
              <a href={demoLink} className="btn btn-primary" target="_blank" rel="noreferrer">
                Solicitar demo
              </a>
              <a href="#modulos" className="btn btn-light">
                Ver como funciona
              </a>
            </div>

            <div className="hero-microcopy">
              <span>Multiempresa</span>
              <span>Roles y accesos</span>
              <span>Soporte remoto</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-card">
              <div className="dashboard-top">
                <span />
                <span />
                <span />
              </div>

              <div className="dashboard-body">
                <div className="metric-grid">
                  <div className="metric-card metric-main">
                    <small>Ventas del dia</small>
                    <strong>$12,480</strong>
                  </div>
                  <div className="metric-card">
                    <small>Inventario</small>
                    <strong>128 productos</strong>
                  </div>
                  <div className="metric-card">
                    <small>Credito activo</small>
                    <strong>18 clientes</strong>
                  </div>
                </div>

                <div className="table-card">
                  <div className="table-head">
                    <span>Producto</span>
                    <span>Stock</span>
                    <span>Estado</span>
                  </div>
                  <div className="table-row">
                    <span>Alimento premium</span>
                    <span>24</span>
                    <span className="ok">OK</span>
                  </div>
                  <div className="table-row">
                    <span>Antiparasitario</span>
                    <span>8</span>
                    <span className="warn">Bajo</span>
                  </div>
                  <div className="table-row">
                    <span>Collar clinico</span>
                    <span>15</span>
                    <span className="ok">OK</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-note note-green">Operacion mas clara</div>
            <div className="floating-note note-purple">Control en un solo lugar</div>
          </div>
        </section>

        <section id="modulos" className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Modulos principales</p>
            <h2>Todo lo importante para operar mejor.</h2>
            <p>
              ankode reune funciones clave para ayudarte a trabajar con mas
              orden, mas control y menos friccion.
            </p>
          </div>

          <div className="modules-grid">
            {moduleCards.map((item) => (
              <article key={item.title} className="module-tile">
                <div className="module-icon">
                  <ModuleIcon name={item.icon} />
                </div>
                <span>{item.title}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section">
          <div className="split-copy">
            <p className="eyebrow">Problema</p>
            <h2>No todos los negocios pueden trabajar con un sistema generico.</h2>
            <p>
              Muchos terminan adaptandose al software, usando procesos incomodos
              o herramientas separadas para poder operar.
            </p>
          </div>

          <div className="problem-stack">
            <article className="soft-card">
              <h3>Procesos dispersos</h3>
              <p>Ventas, inventario y control interno repartidos entre varias herramientas.</p>
            </article>
            <article className="soft-card">
              <h3>Sistemas rigidos</h3>
              <p>No se ajustan a la forma real en que trabaja tu negocio.</p>
            </article>
            <article className="soft-card">
              <h3>Tiempo perdido</h3>
              <p>Seguimientos manuales, menos claridad y mas margen de error.</p>
            </article>
          </div>
        </section>

        <section id="giros" className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Por giro</p>
            <h2>Una solucion pensada para distintos tipos de negocio.</h2>
            <p>
              Cada giro tiene necesidades distintas. Por eso ankode puede
              configurarse segun tu operacion.
            </p>
          </div>

          <div className="industry-grid">
            {industries.map((item) => (
              <article key={item.title} className="industry-card">
                <div
                  className="industry-thumb"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="industry-head">
                  <h3>{item.title}</h3>
                </div>
                <p>{item.desc}</p>
                <a href={`#detalle-${item.id}`}>Quiero conocer mas</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="detalle-giros">
          <div className="section-heading center">
            <p className="eyebrow">Detalle por giro</p>
            <h2>Conoce como se aplica ankode segun tu operacion.</h2>
          </div>
          <div className="industry-grid">
            {industries.map((item) => (
              <article key={`detail-${item.title}`} id={`detalle-${item.id}`} className="industry-card">
                <h3>{item.title}</h3>
                <p>{item.details}</p>
                <a href={buildWhatsAppLink(item.demoMessage)} target="_blank" rel="noreferrer">
                  Solicitar demo para este giro
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="personalizacion" className="section">
          <div className="feature-showcase">
            <div className="feature-copy">
              <p className="eyebrow">Personalizacion</p>
              <h2>Si tu negocio no entra en un molde, ankode tampoco.</h2>
              <p>
                Una de las principales ventajas de ankode es que puede ajustarse
                a la forma en que realmente trabajas.
              </p>
            </div>

            <div className="feature-points">
              <div className="point-card">
                <strong>Configuracion</strong>
                <p>Segun tu operacion real.</p>
              </div>
              <div className="point-card">
                <strong>Roles y accesos</strong>
                <p>De acuerdo con tu equipo.</p>
              </div>
              <div className="point-card">
                <strong>Evolucion</strong>
                <p>Conforme crece tu negocio.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section benefits-layout">
          <div className="section-heading">
            <p className="eyebrow">Beneficios</p>
            <h2>Mas control para tomar mejores decisiones.</h2>
            <p>
              Tener informacion mas clara te ayuda a operar mejor y crecer con
              mas orden.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((item) => (
              <article key={item.title} className="benefit-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}

            <article className="benefit-card benefit-card-large">
              <h3>Un sistema que se adapta a tu operacion.</h3>
              <p>
                ankode esta pensado para ayudarte a tener mas control sin
                complicar el trabajo diario.
              </p>
              <ul>
                <li>Centraliza la operacion en un solo lugar</li>
                <li>Facilita el control de inventario, ventas y seguimiento</li>
                <li>Permite organizar accesos y funciones por usuario</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Como funciona</p>
            <h2>Un proceso simple para comenzar.</h2>
            <p>
              Empezamos entendiendo tu negocio para mostrarte como ankode puede ayudarte.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step} className="step-card">
                <div className="step-number">{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="section">
          <div className="section-heading center">
            <p className="eyebrow">FAQ</p>
            <h2>Preguntas frecuentes</h2>
            <p>Resolvemos las dudas mas comunes antes de empezar.</p>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="faq-card">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="cta" className="section">
          <div className="cta-panel">
            <p className="eyebrow">CTA final</p>
            <h2>Deja de adaptar tu negocio al sistema.</h2>
            <p>
              Mejor usa un sistema que pueda adaptarse a tu forma de trabajar.
            </p>
            <div className="hero-actions center-actions">
              <a href={demoLink} className="btn btn-primary" target="_blank" rel="noreferrer">
                Solicitar demo
              </a>
              <a href={contactEmailLink} className="btn btn-light">
                Contactar por email
              </a>
            </div>
            <div className="contact-links">
              <a href={demoLink} target="_blank" rel="noreferrer">WhatsApp: {CONTACT.whatsapp}</a>
              <a href={contactEmailLink}>Email: {CONTACT.email}</a>
              <a href={phoneLink}>Telefono: {CONTACT.phone}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <p>
            Sistema POS adaptable para negocios que necesitan mas control, mas
            orden y una solucion pensada para su operacion real.
          </p>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Producto</h4>
            <a href="#modulos">Modulos</a>
            <a href="#giros">Por giro</a>
            <a href="#personalizacion">Personalizacion</a>
          </div>
          <div>
            <h4>Empresa</h4>
            <a href={demoLink} target="_blank" rel="noreferrer">Solicitar demo</a>
            <a href="#faq">Preguntas frecuentes</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href={demoLink} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={contactEmailLink}>Email</a>
            <a href={phoneLink}>Telefono</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
