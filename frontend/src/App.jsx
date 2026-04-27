import "./App.css";
import ankodeLogo from "./assets/ankode-logo.png";
import { useState } from 'react';
import { PLANS } from './constants/plans';
import PricingSection from './components/PricingSection';
import CheckoutModal from './components/CheckoutModal';

const CONTACT = {
  whatsapp: "525535803405",
  email: "ankodemx@gmail.com",
};

const cleanWhatsAppNumber = CONTACT.whatsapp.replace(/\D/g, "");

const buildWhatsAppLink = (message) =>
  `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(message)}`;

const buildMailtoLink = (subject, body) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const demoLink = buildWhatsAppLink("Hola, quiero solicitar una demo de ankode.");
const contactEmailLink = buildMailtoLink(
  "Quiero información de ankode",
  "Hola, me gustaría recibir información sobre ankode y agendar una demo."
);

const moduleCards = [
  { title: "Ventas", icon: "sales", desc: "Registra cada venta, aplica descuentos, gestiona métodos de pago y genera tu corte de caja diario." },
  { title: "Inventario", icon: "inventory", desc: "Controla tu stock en tiempo real, recibe alertas de productos bajos y lleva el historial de movimientos." },
  { title: "Proveedores", icon: "suppliers", desc: "Administra tus proveedores, registra órdenes de compra y da seguimiento a reabastecimientos." },
  { title: "Crédito y cobranza", icon: "credit", desc: "Vende a crédito, lleva el saldo de cada cliente y envía recordatorios de pago automáticos." },
  { title: "Finanzas básicas", icon: "finance", desc: "Visualiza ingresos, egresos y utilidad de tu negocio en reportes claros por período." },
  { title: "Recordatorios", icon: "reminders", desc: "Programa y automatiza recordatorios para clientes con pagos pendientes o citas próximas." },
  { title: "Soporte remoto", icon: "support", desc: "Accede a soporte técnico sin necesidad de visitas presenciales — resolvemos desde donde estás." },
  { title: "Roles y accesos", icon: "access", desc: "Asigna permisos específicos a cada usuario: Admin, Cajero, Almacén, Vendedor y Gerente." },
];

const industries = [
  {
    id: "veterinaria",
    title: "Veterinaria",
    desc: "Organiza ventas, productos y operación diaria con una base flexible para crecer según tu forma de trabajar.",
    details:
      "Control de inventario clínico, seguimiento de productos y operación diaria en un mismo flujo.",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para veterinaria",
  },
  {
    id: "retail",
    title: "Retail",
    desc: "Controla inventario, proveedores y ventas en tienda con más claridad y menos errores.",
    details:
      "Inventario, reposición y ventas centralizadas para mantener orden operativo y mejor visibilidad.",
    image:
      "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para retail",
  },
  {
    id: "restaurantes",
    title: "Restaurantes",
    desc: "Centraliza venta, control interno y operación diaria para trabajar con mayor orden.",
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
      "Seguimiento de inventario y ventas con una vista clara para tomar decisiones más rápidas.",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para farmacia",
  },
  {
    id: "consultorios",
    title: "Consultorios",
    desc: "Organiza cobros, seguimiento y operación administrativa en un flujo simple.",
    details:
      "Estructura de trabajo para ordenar tareas internas y simplificar la operación diaria.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    demoMessage: "Hola, quiero una demo de ankode para consultorio",
  },
];

const benefits = [
  {
    title: "Más control",
    text: "Ten una visión más clara de ventas, inventario y operación sin depender de procesos manuales.",
  },
  {
    title: "Más orden",
    text: "Centraliza tareas clave en un solo sistema y reduce la dispersión entre herramientas.",
  },
  {
    title: "Más adaptación",
    text: "Si tu negocio necesita algo distinto, ankode puede ajustarse a tu operación real.",
  },
];

const steps = [
  "Conocemos tu operación",
  "Revisamos lo que necesitas controlar",
  "Configuramos una propuesta acorde a tu negocio",
  "Te acompañamos en la implementación",
];

const faqs = [
  {
    q: "¿Sirve para cualquier negocio?",
    a: "Está pensado para adaptarse a distintos giros, especialmente veterinaria y retail.",
  },
  {
    q: "¿Es difícil de usar?",
    a: "No. La idea es que sea práctico y claro para la operación diaria.",
  },
  {
    q: "¿Ya está listo para restaurantes?",
    a: "Sí, puede configurarse para la operación de este giro.",
  },
  {
    q: "¿Se puede ajustar a mi proceso?",
    a: "Sí. Esa es una de las ideas principales detrás de ankode.",
  },
];

const accessories = [
  {
    id: "laptop",
    name: "Laptop Asus Vivobook Go",
    desc: "Intel Celeron N4500, 4GB RAM, 128GB SSD. Ideal para operar tu punto de venta con movilidad.",
    price: 4999,
    emoji: "💻",
  },
  {
    id: "pc-all-in-one",
    name: 'PC All In One 23.8" AKIOEK',
    desc: "Intel Core i5, 8GB RAM, 256GB SSD, pantalla Full HD. Todo en uno para tu punto de venta fijo.",
    price: 6999,
    emoji: "🖥️",
  },
  {
    id: "tablet",
    name: 'All In One Touch Higole 10.1"',
    desc: "RK3399, 1080p, Android 12. Pantalla táctil ideal como terminal de punto de venta fija o secundaria.",
    price: 5199,
    emoji: "📱",
  },
  {
    id: "scanner",
    name: "Escáner de código de barras Shawty",
    desc: "Inalámbrico 1D y 2D, USB con Bluetooth y batería. Agiliza el registro de productos en caja.",
    price: 449,
    emoji: "📡",
  },
  {
    id: "printer",
    name: "Impresora térmica de tickets SUZWIP",
    desc: "58mm, Bluetooth + USB, incluye 5 rollos de papel. Imprime tickets y comprobantes al instante.",
    price: 599,
    emoji: "🖨️",
  },
  {
    id: "cashbox",
    name: "Cajón de dinero Nextep NE-514",
    desc: "4 compartimentos para billetes, 8 para monedas, color negro. Resguarda tu efectivo de forma segura.",
    price: 999,
    emoji: "💰",
  },
];

function CartIcon({ count }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Carrito de compras"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            background: 'var(--purple)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '0.68rem',
            fontWeight: 800,
            minWidth: 18,
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

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

function CartDrawer({ cart, onClose, onRemoveItem, onCheckout }) {
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          zIndex: 999,
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh',
        width: 360, background: 'white', zIndex: 1000,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0 }}>Tu carrito</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>

        {cart.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>Tu carrito está vacío.</p>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    ${item.price.toLocaleString('es-MX')} × {item.qty}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <strong style={{ color: 'var(--purple)' }}>
                    ${(item.price * item.qty).toLocaleString('es-MX')}
                  </strong>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.1rem' }}
                  >🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div style={{ marginTop: 24, borderTop: '2px solid var(--border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <strong>Total</strong>
              <strong style={{ color: 'var(--purple)', fontSize: '1.2rem' }}>
                ${total.toLocaleString('es-MX')} MXN
              </strong>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => { onClose(); onCheckout(); }}
            >
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectPlan = (planId) => {
    const plan = PLANS.find(p => p.id === planId) || null;
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleSubmitPayment = async (formData) => {
    console.log('Payment submitted:', formData);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand brand-real">
          <img src={ankodeLogo} alt="ankode" className="brand-logo" style={{ height: '32px', width: 'auto' }} />
        </div>

        <nav className="topnav">
          <a href="#modulos">Módulos</a>
          <a href="#giros">Por giro</a>
          <a href="#personalizacion">Personalización</a>
          <a href="#faq">Preguntas frecuentes</a>
          <a href="#planes">Planes</a>
        </nav>

        <div className="topbar-actions">
          <button
            className="btn btn-light cart-btn"
            aria-label="Ver carrito"
            onClick={() => setIsCartOpen(prev => !prev)}
            style={{ padding: '0 16px', gap: 8 }}
          >
            <CartIcon count={cartCount} />
            {cartCount > 0 && <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Carrito</span>}
          </button>
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
              Ventas, inventario, proveedores y operación diaria en una solución
              pensada para la realidad de tu negocio.
            </p>

            <div className="hero-actions">
              <a href={demoLink} className="btn btn-primary" target="_blank" rel="noreferrer">
                Solicitar demo
              </a>
              <a href="#modulos" className="btn btn-light">
                Ver cómo funciona
              </a>
              <a href="#planes" className="btn btn-primary">Ver planes y precios</a>
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
                    <small>Ventas del día</small>
                    <strong>$12,480</strong>
                  </div>
                  <div className="metric-card">
                    <small>Inventario</small>
                    <strong>128 productos</strong>
                  </div>
                  <div className="metric-card">
                    <small>Crédito activo</small>
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
                    <span>Collar clínico</span>
                    <span>15</span>
                    <span className="ok">OK</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-note note-green">Operación más clara</div>
            <div className="floating-note note-purple">Control en un solo lugar</div>
          </div>
        </section>

        <section id="modulos" className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Módulos principales</p>
            <h2>Todo lo importante para operar mejor.</h2>
            <p>
              ankode reúne funciones clave para ayudarte a trabajar con más
              orden, más control y menos fricción.
            </p>
          </div>

          <div className="modules-grid">
            {moduleCards.map((item) => (
              <article
                key={item.title}
                className="module-tile"
                style={{
                  cursor: 'pointer',
                  border: activeModule === item.title ? '1.5px solid var(--purple)' : '1.5px solid transparent',
                  transition: 'border 0.2s ease',
                }}
                onClick={() => setActiveModule(prev => prev === item.title ? null : item.title)}
              >
                <div className="module-icon">
                  <ModuleIcon name={item.icon} />
                </div>
                <span>{item.title}</span>
                {activeModule === item.title && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: '8px 0 0', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section">
          <div className="split-copy">
            <p className="eyebrow">Problema</p>
            <h2>No todos los negocios pueden trabajar con un sistema genérico.</h2>
            <p className="text-justify">
              Muchos terminan adaptándose al software, usando procesos incómodos
              o herramientas separadas para poder operar.
            </p>
          </div>

          <div className="problem-stack">
            <article className="soft-card">
              <h3>Procesos dispersos</h3>
              <p className="text-justify">Ventas, inventario y control interno repartidos entre varias herramientas.</p>
            </article>
            <article className="soft-card">
              <h3>Sistemas rígidos</h3>
              <p className="text-justify">No se ajustan a la forma real en que trabaja tu negocio.</p>
            </article>
            <article className="soft-card">
              <h3>Tiempo perdido</h3>
              <p className="text-justify">Seguimientos manuales, menos claridad y más margen de error.</p>
            </article>
          </div>
        </section>

        <section id="giros" className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Por giro</p>
            <h2>Una solución pensada para distintos tipos de negocio.</h2>
            <p>
              Cada giro tiene necesidades distintas. Por eso ankode puede
              configurarse según tu operación.
            </p>
          </div>

          <div className="industry-grid industry-grid-centered">
            {industries.map((item) => (
              <article key={item.title} className="industry-card">
                <div
                  className="industry-thumb"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="industry-head">
                  <h3>{item.title}</h3>
                </div>
                <p className="text-justify">{item.desc}</p>
                <a href={`#detalle-${item.id}`}>Quiero conocer más</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="detalle-giros">
          <div className="section-heading center">
            <p className="eyebrow">Detalle por giro</p>
            <h2>Conoce cómo se aplica ankode según tu operación.</h2>
          </div>
          <div className="industry-grid industry-grid-centered">
            {industries.map((item) => (
              <article key={`detail-${item.title}`} id={`detalle-${item.id}`} className="industry-card">
                <h3>{item.title}</h3>
                <p className="text-justify">{item.details}</p>
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
              <p className="eyebrow">Personalización</p>
              <h2>Ankode se adapta a tu negocio, no al revés.</h2>
              <p className="text-justify">
                Una de las principales ventajas de ankode es que puede ajustarse
                a la forma en que realmente trabajas.
              </p>
            </div>

            <div className="feature-points">
              <div className="point-card">
                <strong>Configuración</strong>
                <p className="text-justify">Según tu operación real.</p>
              </div>
              <div className="point-card">
                <strong>Roles y accesos</strong>
                <p className="text-justify">De acuerdo con tu equipo.</p>
              </div>
              <div className="point-card">
                <strong>Evolución</strong>
                <p className="text-justify">Conforme crece tu negocio.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section benefits-layout">
          <div className="section-heading">
            <p className="eyebrow">Beneficios</p>
            <h2>Más control para tomar mejores decisiones.</h2>
            <p className="text-justify">
              Tener información más clara te ayuda a operar mejor y crecer con
              más orden.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((item) => (
              <article key={item.title} className="benefit-card">
                <h3>{item.title}</h3>
                <p className="text-justify">{item.text}</p>
              </article>
            ))}

            <article className="benefit-card benefit-card-large">
              <h3>Un sistema que se adapta a tu operación.</h3>
              <p className="text-justify">
                ankode está pensado para ayudarte a tener más control sin
                complicar el trabajo diario.
              </p>
              <ul>
                <li>Centraliza la operación en un solo lugar</li>
                <li>Facilita el control de inventario, ventas y seguimiento</li>
                <li>Permite organizar accesos y funciones por usuario</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Cómo funciona</p>
            <h2>Un proceso simple para comenzar.</h2>
            <p>
              Empezamos entendiendo tu negocio para mostrarte cómo ankode puede ayudarte.
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

        <PricingSection
          onSelectPlan={handleSelectPlan}
          onAddToCart={handleAddToCart}
          isAnnual={isAnnual}
          onToggleAnnual={() => setIsAnnual(prev => !prev)}
        />

        {/* Accesorios y Extras */}
        <section id="accesorios" className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">Accesorios y Extras</p>
            <h2>Complementa tu plan con el equipo que necesitas.</h2>
            <p>
              Agrega los accesorios que mejor se adapten a tu operación y págalos por separado.
            </p>
          </div>
          <div className="accessories-grid">
            {accessories.map((item) => (
              <article key={item.id} className="accessory-card">
                <div style={{
                  fontSize: '4rem',
                  textAlign: 'center',
                  padding: '28px 0 12px',
                  background: 'var(--bg-soft)',
                  borderRadius: '16px 16px 0 0',
                }}>
                  {item.emoji}
                </div>
                <div className="accessory-body">
                  <h3>{item.name}</h3>
                  <p className="text-justify">{item.desc}</p>
                  <div className="accessory-price">${item.price.toLocaleString('es-MX')} MXN</div>
                  <button
                    className="btn btn-outline"
                    style={{ width: '100%', marginTop: 12, cursor: 'pointer' }}
                    onClick={() => handleAddToCart({ id: item.id, name: item.name, price: item.price, type: 'accessory' })}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="section">
          <div className="section-heading center">
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2>Lo que más nos preguntan</h2>
            <p>Resolvemos las dudas más comunes antes de empezar.</p>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="faq-card">
                <summary>{item.q}</summary>
                <p className="text-justify">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="cta" className="section">
          <div className="cta-panel">
            <h2>Deja de adaptar tu negocio al sistema.</h2>
            <p className="text-justify" style={{ maxWidth: 560, margin: '16px auto' }}>
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
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <p>
            Sistema POS adaptable para negocios que necesitan más control, más
            orden y una solución pensada para su operación real.
          </p>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Producto</h4>
            <a href="#modulos">Módulos</a>
            <a href="#giros">Por giro</a>
            <a href="#personalizacion">Personalización</a>
          </div>
          <div>
            <h4>Empresa</h4>
            <a href={demoLink} target="_blank" rel="noreferrer">Solicitar demo</a>
            <a href="#faq">Preguntas frecuentes</a>
            <a href="/legal?doc=terms" target="_blank" rel="noreferrer">Términos y condiciones</a>
            <a href="/legal?doc=cancellation" target="_blank" rel="noreferrer">Cancelación</a>
            <a href="/legal?doc=privacy" target="_blank" rel="noreferrer">Privacidad de pago</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href={demoLink} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={contactEmailLink}>Email</a>
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '12px 24px', color: 'var(--muted)', fontSize: '0.85rem' }}>
          <span>© 2025 Ankode · Todos los derechos reservados</span>
          <a href="/legal?doc=terms" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)' }}>Términos y condiciones</a>
          <a href="/legal?doc=cancellation" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)' }}>Política de cancelación</a>
          <a href="/legal?doc=privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)' }}>Privacidad de pago</a>
          <span>Pagos procesados por Openpay by BBVA</span>
        </div>
      </footer>

      {isCheckoutOpen && (selectedPlan || cart.length > 0) && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlan?.id}
          isAnnual={isAnnual}
          onSubmitPayment={handleSubmitPayment}
          cart={cart}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            if (!selectedPlan) {
              const firstPlan = cart.find(item => item.type === 'plan');
              if (firstPlan) {
                const planData = PLANS.find(p => p.id === firstPlan.id);
                if (planData) setSelectedPlan(planData);
                else setSelectedPlan({ id: 'cart', name: 'Carrito', monthlyPrice: 0, annualPrice: 0, extraBranchPrice: 0, includedBranches: 1 });
              } else {
                setSelectedPlan({ id: 'cart', name: 'Carrito', monthlyPrice: 0, annualPrice: 0, extraBranchPrice: 0, includedBranches: 1 });
              }
            }
            setIsCheckoutOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
