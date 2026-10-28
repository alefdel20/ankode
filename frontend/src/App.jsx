import "./Landing.css";
import { useState } from "react";
import videoVenta from "./assets/videos/venta-real.mp4";
import posterVenta from "./assets/videos/venta-real-poster.webp";
import videoOnboarding from "./assets/videos/onboarding.mp4";
import posterOnboarding from "./assets/videos/onboarding-poster.webp";
import videoRestaurante from "./assets/videos/restaurante.mp4";
import posterRestaurante from "./assets/videos/restaurante-poster.webp";
import videoVeterinaria from "./assets/videos/veterinaria.mp4";
import posterVeterinaria from "./assets/videos/veterinaria-poster.webp";
import ankodeLogo from "./assets/ankode-logo-oficial.png";
import CheckoutModal from "./components/CheckoutModal";

// Agente de WhatsApp que da la demo; si falla, él mismo canaliza con una persona.
const WA_AGENT = "525515133527";
const wa = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
const DEMO_URL = wa(WA_AGENT, "Hola, quiero ver la demo de Ankode POS");

const STEPS = [
  ["Escríbenos por WhatsApp", "Nuestro asistente te muestra el sistema en tu celular y resuelve tus dudas."],
  ["Arma tu catálogo", "Entras con un catálogo precargado que puedes modificar, o agregas tus propios productos."],
  ["Cobra tu primera venta", "Caja, inventario y factura ya vienen conectados desde el primer ticket."],
];

const FEATURES = [
  ["Ventas rápidas", "Cobro con código de barras, efectivo, tarjeta o SPEI."],
  ["Inventario en tiempo real", "Stock por sucursal y alerta de stock bajo en cada producto."],
  ["Crédito y cobranza", "Sabes quién te debe, cuánto y desde cuándo."],
  ["Combos y promociones", "Arma kits con descuento y remata lo que se mueve lento."],
  ["Reportes", "Ventas, utilidad bruta y productos más vendidos."],
  ["Equipo y sucursales", "Cinco roles de usuario y varias sucursales en el mismo sistema."],
];

const COMPARE = [
  ["Inventario al momento", "Se cuenta a mano", "Se captura aparte", "Baja con cada venta"],
  ["Corte de caja", "Suma manual", "Fórmulas propias", "Diario y automático"],
  ["Quién te debe", "Apuntes sueltos", "Otra hoja", "Crédito y cobranza"],
  ["Factura CFDI 4.0", "Otro sistema", "Otro sistema", "Desde el ticket, incluida"],
  ["Utilidad bruta", "Difícil de saber", "Si armas el reporte", "Reporte listo"],
];

const PLANS = [
  {
    id: "basico",
    name: "Básico",
    monthly: "$349",
    annual: "$3,490",
    items: [
      "1 sucursal incluida (sucursal extra: +$149 al mes)",
      "POS, inventario, crédito y cobranza, reportes y 5 roles",
      "Factura CFDI 4.0 con 100 timbres al mes",
      "Onboarding con catálogo precargado",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthly: "$699",
    annual: "$6,990",
    dark: true,
    items: [
      "3 sucursales incluidas (sucursal extra: +$129 al mes)",
      "Todo lo del Básico, con 300 timbres al mes",
      "Reportes por período y análisis de tendencias",
      "Alertas de tu negocio en tu WhatsApp",
      ["Tablero financiero por sucursal", "Próximamente"],
    ],
  },
];

const GIROS = [
  {
    id: "retail",
    tag: "Listo para usar hoy",
    title: "Retail: tiendas, papelerías y tlapalerías",
    text: "Venta por código de barras, inventario, crédito a clientes y factura desde el ticket. Es el módulo listo para producción.",
    clips: [
      { src: videoVenta, poster: posterVenta, height: 476, caption: "Venta: cobro en efectivo, cambio y ticket al instante.", label: "Grabación real de una venta: dos productos en el carrito, cobro de $65 con $100 en efectivo, cambio de $35 y ticket generado" },
      { src: videoOnboarding, poster: posterOnboarding, height: 558, caption: "Alta de una papelería: 48 productos listos. Revisión acelerada ×4.", label: "Grabación real del alta de una papelería: revisa los precios del catálogo precargado, confirma 48 productos y entra a Ventas" },
    ],
  },
  {
    id: "beta",
    tag: "Beta abierta",
    title: "Restaurantes y veterinarias",
    text: "Entra con precio de lanzamiento: durante la beta pagas lo mismo que en Retail ($349 o $699 al mes). Pruébalos antes que nadie y ayúdanos a mejorarlos.",
    clips: [
      { src: videoRestaurante, poster: posterRestaurante, height: 380, caption: "Restaurante: comanda, pantalla de cocina, dividir cuenta y cobro. Acelerado ×2.", label: "Grabación real del módulo de restaurante: se agrega una bebida a la comanda de la mesa 1, se envía a cocina, la pantalla de cocina la marca como lista, se divide la cuenta y se cobra" },
      { src: videoVeterinaria, poster: posterVeterinaria, height: 396, caption: "Veterinaria: consultas, recetas y carnet del paciente.", label: "Grabación real del módulo de veterinaria: lista de consultas y recetas, nueva consulta y carnet veterinario del paciente con su historial" },
    ],
  },
];

// Pendientes de Ale, fuera de la página hasta confirmarlos:
// - FAQ: ¿funciona sin internet?, ¿puedo pasar mi inventario?, ¿qué lector e impresora necesito?
// - Testimonios reales de clientes del POS (no inventar).
// - Qué alertas de WhatsApp se envían hoy (los mensajes de abajo son ilustrativos).
const FAQ = [
  ["¿Quién me atiende por WhatsApp?", "Un asistente automático responde tus dudas y te da la demo al momento. Si no logra resolver algo, te canaliza con una persona de nuestro equipo."],
  ["¿Tengo que tramitar algo ante el SAT para facturar?", "No. El timbrado se hace por medio de un PAC certificado y tú no manejas ese proceso."],
  ["¿Hay contrato forzoso?", "No, cancelas cuando quieras."],
  ["¿Cuántas facturas incluye mi plan?", "El Básico incluye 100 timbres al mes y el Premium 300. Si te pasas, cada timbre extra cuesta $1."],
  ["¿En cuánto tiempo puedo empezar a vender?", "Puedes empezar a operar en unos 5 a 15 minutos. Entras con un catálogo precargado que puedes modificar, o agregas tus propios productos."],
  ["No soy de tecnología, ¿me dejan solo?", "No. Todos los planes incluyen soporte técnico y te acompañamos durante la implementación."],
  ["¿Ya está listo para restaurantes y veterinarias?", "Están en beta abierta: puedes usarlos y ayudarnos a mejorarlos. El módulo de tiendas ya está listo para producción. Durante la beta pagas el mismo precio que en Retail."],
];

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 9.5c.3 2.3 2.2 4.4 4.6 5l1.3-1.3 2 1-.4 1.6c-3.8.3-8-3.6-8-7.6l1.6-.5 1 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

// Clip mudo en bucle; con "reducir movimiento" no arranca solo y muestra controles.
function Clip({ src, poster, width, height, label }) {
  const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <video src={src} poster={poster} width={width} height={height} muted loop playsInline preload="metadata"
      autoPlay={!still} controls={still} aria-label={label} />
  );
}

function App() {
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [giro, setGiro] = useState("retail");

  return (
    <div className="lp">
      <header className="lp-top"><div className="lp-wrap lp-nav">
        <a href="/" className="lp-logo"><img src={ankodeLogo} width="850" height="294" alt="ankode" /></a>
        <nav className="lp-nav-links" aria-label="Secciones">
          <a href="#que">Qué incluye</a>
          <a href="#giros">Giros</a>
          <a href="#precios">Precios</a>
          <a href="#faq">Preguntas</a>
          <a href={DEMO_URL} className="lp-btn lp-btn--lime lp-btn--pill">Pedir demo por WhatsApp</a>
        </nav>
      </div></header>

      <main>
        <section className="lp-wrap lp-hero">
          <div>
            <h1>Tu tienda sin el cuaderno.</h1>
            <p className="lp-hero-for">Punto de venta para <mark>tiendas, papelerías y tlapalerías.</mark></p>
            <p className="lp-hero-copy">Cobras, sabes qué te queda en el estante, controlas lo que te deben y facturas CFDI 4.0 desde el mismo ticket. Hecho en México, con soporte directo del desarrollador.</p>
            <ul className="lp-chips">
              <li>Operando en 5 a 15 minutos</li>
              <li>Catálogo precargado</li>
              <li>Factura CFDI incluida</li>
            </ul>
            <div className="lp-hero-cta">
              <a href={DEMO_URL} className="lp-btn lp-btn--purple"><WhatsAppIcon />Ver demo en mi celular</a>
              <small>Desde $349 al mes, con IVA y factura incluidos</small>
            </div>
          </div>

          <div className="lp-ticket-stage">
            <div className="lp-ticket" role="img" aria-label="Ticket de venta de ejemplo de una tlapalería: total $238.00, con factura CFDI 4.0 lista desde el ticket">
              <div className="lp-ticket-store">Tlapalería El Tornillo</div>
              <div className="lp-ticket-meta">Ticket de venta · ejemplo</div>
              <hr />
              <div className="lp-ticket-row"><span>1 × Chapa de perilla</span><span>$189.00</span></div>
              <div className="lp-ticket-row"><span>3 × Lija de agua #120</span><span>$27.00</span></div>
              <div className="lp-ticket-row"><span>1 × Cinta de aislar</span><span>$22.00</span></div>
              <hr />
              <div className="lp-ticket-total"><span>Total</span><span>$238.00</span></div>
              <div className="lp-ticket-cfdi">Factura CFDI 4.0 lista desde este ticket</div>
            </div>
          </div>
        </section>

        <section className="lp-band">
          <div className="lp-wrap">
            <h2>Lo que cambia desde la primera semana.</h2>
            <div className="lp-band-cols">
              <div><h3>Antes</h3><p>Cuaderno, Excel y la memoria. Al cierre no sabes si cuadró la caja ni qué producto se acabó.</p></div>
              <div><h3>Con Ankode</h3><p>Corte de caja diario, inventario que baja solo con cada venta y reporte de utilidad bruta cuando lo necesitas.</p></div>
              <div><h3>Y si te piden factura</h3><p>La generas ahí mismo, con timbrado vía PAC. No tienes que tramitar nada ante el SAT por tu cuenta. Incluye 100 timbres al mes en Básico y 300 en Premium.</p></div>
            </div>
          </div>
        </section>

        <section id="empieza" className="lp-wrap lp-section">
          <h2 className="lp-h2">Vendiendo en 5 a 15 minutos.</h2>
          <ol className="lp-steps">
            {STEPS.map(([title, text]) => (
              <li key={title}><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
          <figure className="lp-shot">
            <Clip src={videoOnboarding} poster={posterOnboarding} width="720" height="558" label="Grabación real del alta de una papelería: revisa los precios del catálogo precargado, confirma 48 productos y entra a Ventas" />
            <figcaption>Alta real de una papelería: 48 productos listos para vender. La revisión del catálogo va acelerada ×4.</figcaption>
          </figure>
        </section>

        <section id="que" className="lp-wrap lp-section">
          <h2 className="lp-h2">¿Qué incluye?, sin letras chiquitas.</h2>
          <figure className="lp-shot">
            <Clip src={videoVenta} poster={posterVenta} width="720" height="476" label="Grabación real de una venta: dos productos en el carrito, cobro de $65 con $100 en efectivo, cambio de $35 y ticket generado" />
            <figcaption>Venta real en el módulo Retail: cobro en efectivo, cambio y ticket al instante.</figcaption>
          </figure>
          <dl className="lp-features">
            {FEATURES.map(([title, text]) => (
              <div key={title}><dt>{title}</dt><dd>{text}</dd></div>
            ))}
          </dl>
        </section>

        <section id="comparar" className="lp-wrap lp-section">
          <h2 className="lp-h2">Cuaderno, Excel o Ankode.</h2>
          <div className="lp-compare-scroll" tabIndex={0} role="region" aria-label="Comparación entre cuaderno, Excel y Ankode">
            <table className="lp-compare">
              <thead>
                <tr><th scope="col"><span className="sr-only">Tarea</span></th><th scope="col">Cuaderno</th><th scope="col">Excel</th><th scope="col" className="is-us">Ankode</th></tr>
              </thead>
              <tbody>
                {COMPARE.map(([task, book, excel, us]) => (
                  <tr key={task}><th scope="row">{task}</th><td>{book}</td><td>{excel}</td><td className="is-us">{us}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="giros" className="lp-wrap lp-section">
          <div className="lp-giro-tabs" role="tablist" aria-label="Giros">
            {GIROS.map((g) => {
              const selected = giro === g.id;
              return (
                <div key={g.id} id={`tab-${g.id}`} role="tab" tabIndex={0} aria-selected={selected} aria-controls="giro-videos"
                  className={`lp-giro lp-giro--${g.id}`} onClick={() => setGiro(g.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setGiro(g.id); } }}>
                  <span className={`lp-tag ${g.id === "retail" ? "lp-tag--lime" : "lp-tag--soft"}`}>{g.tag}</span>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                  <span className="lp-giro-hint">{selected ? "Viendo sus videos" : "Ver sus videos"}</span>
                </div>
              );
            })}
          </div>
          <div id="giro-videos" role="tabpanel" aria-labelledby={`tab-${giro}`} className="lp-giro-videos">
            {GIROS.find((g) => g.id === giro).clips.map((c) => (
              <figure key={c.src} className="lp-shot">
                <Clip src={c.src} poster={c.poster} width="720" height={c.height} label={c.label} />
                <figcaption>{c.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="lp-wrap lp-section">
          <div className="lp-premium">
            <div>
              <span className="lp-tag lp-tag--lime">Solo en Premium</span>
              <h2>Tu negocio te avisa en WhatsApp.</h2>
              <p>Recibe las alertas importantes sin abrir el sistema. Con varias sucursales, el dueño se entera de lo que pasa en cada una.</p>
            </div>
            <div className="lp-chat">
              <div className="lp-chat-note">Ejemplo ilustrativo</div>
              <div className="lp-bubble"><b>Alerta Ankode</b> · Sucursal Centro: quedan 5 piezas de Cinta de aislar.</div>
              <div className="lp-bubble"><b>Alerta Ankode</b> · Sucursal Norte: un cliente pasó de su fecha de pago.</div>
            </div>
          </div>
        </section>

        <section id="precios" className="lp-wrap lp-section">
          <h2 className="lp-h2">Precios públicos. IVA incluido.</h2>
          <p className="lp-lead">Sin contrato forzoso: cancelas cuando quieras. Timbres extra: $1 cada uno cuando pases el tope del mes.</p>
          <div className="lp-billing" role="radiogroup" aria-label="Forma de pago">
            <button type="button" role="radio" aria-checked={!isAnnual} onClick={() => setIsAnnual(false)}>Pago mensual</button>
            <button type="button" role="radio" aria-checked={isAnnual} onClick={() => setIsAnnual(true)}>Pago anual · 2 meses gratis</button>
          </div>
          <div className="lp-plans">
            {PLANS.map((plan) => (
              <article key={plan.name} className={`lp-plan${plan.dark ? " lp-plan--dark" : ""}`}>
                <div className="lp-plan-name">
                  <h3>{plan.name}</h3>
                  {plan.dark && <span className="lp-tag lp-tag--lime">Más elegido</span>}
                </div>
                <div className="lp-price">{isAnnual ? plan.annual : plan.monthly}<span>{isAnnual ? " /año" : " /mes"}</span></div>
                {isAnnual && <div className="lp-annual">2 meses gratis el primer año</div>}
                <ul>
                  {plan.items.map((item) => {
                    const [text, soon] = Array.isArray(item) ? item : [item];
                    return <li key={text}><CheckIcon /><span>{text}{soon && <em>{soon}</em>}</span></li>;
                  })}
                </ul>
                <button type="button" className={`lp-btn ${plan.dark ? "lp-btn--lime" : "lp-btn--purple"} lp-plan-buy`} onClick={() => setCheckoutPlan(plan.id)}>
                  Comprar {plan.name} {isAnnual ? "anual" : "mensual"}
                </button>
                <a className="lp-plan-ask" href={wa(WA_AGENT, `Hola, quiero ver la demo del plan ${plan.name} de Ankode POS`)}>Preguntar por {plan.name} en WhatsApp</a>
              </article>
            ))}
          </div>
          {isAnnual && <p className="lp-fine">Plan anual: pagas 10 mensualidades y recibes 12 meses de servicio durante el primer año.</p>}
        </section>

        <section id="faq" className="lp-wrap lp-section lp-faq">
          <h2 className="lp-h2">Lo que todos preguntan.</h2>
          <div className="lp-faq-list">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<PlusIcon /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="lp-wrap">
          <div className="lp-final">
            <div>
              <h2>Ve el sistema funcionando en tu celular.</h2>
              <p>Nuestro asistente de WhatsApp te lo muestra en minutos, sin compromiso.</p>
            </div>
            <a href={DEMO_URL} className="lp-btn lp-btn--ink"><WhatsAppIcon />Escribir por WhatsApp</a>
          </div>
        </section>
      </main>

      <footer className="lp-wrap lp-foot">
        <span>ankode.cloud · Demo por WhatsApp: 55 1513 3527 · <a href="mailto:contacto@ankode.cloud">contacto@ankode.cloud</a> · Pagos procesados por Openpay</span>
        <nav aria-label="Otros enlaces">
          <a href="/legal?doc=terms">Términos y condiciones</a>
          <a href="/legal?doc=cancellation">Política de cancelación</a>
          <a href="/legal?doc=privacy">Privacidad de pago</a>
          <a href="/paginas-web">¿Necesitas página web? Ankode Freelance</a>
        </nav>
      </footer>

      {checkoutPlan && (
        <CheckoutModal
          isOpen
          onClose={() => setCheckoutPlan(null)}
          selectedPlan={checkoutPlan}
          isAnnual={isAnnual}
          onSubmitPayment={() => setCheckoutPlan(null)}
        />
      )}
    </div>
  );
}

export default App;
