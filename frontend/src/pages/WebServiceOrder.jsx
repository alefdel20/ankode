import { useState } from 'react';
import ankodeLogo from '../assets/ankode-logo.png';

const BASICO = {
  id: 'basico',
  name: 'Presencia básica',
  setup: '$1,990',
  monthly: '$299/mes',
  annual: '$2,490/año',
  annualNote: '2 meses gratis',
  iva: '$2,655.24',
  days: '5',
  includes: [
    'Subdominio ankode.cloud',
    'Hasta 3 secciones',
    'Diseño con tu identidad visual',
    'Horarios, mapa y catálogo (12 items)',
    'Botón WhatsApp flotante',
    'SSL incluido',
  ],
};

const AVANZADO = {
  id: 'avanzado',
  name: 'Página avanzada',
  setup: '$6,990',
  monthly: '$499/mes',
  annual: '$4,990/año',
  annualNote: 'Dominio .com.mx año 1 incluido',
  iva: '$8,668.84',
  days: '15',
  includes: [
    'Dominio .com.mx propio (año 1 incluido)',
    'Hasta 6 secciones',
    'Tienda online o reservas/citas',
    'Pagos con tarjeta y SPEI vía Openpay',
    'SEO básico + Google Analytics',
    'Galería, testimonios, formulario',
    'Certificación Openpay gestionada',
  ],
};

const STEPS = [
  { emoji: '📋', title: 'Elige tu plan',            desc: 'Básico o Avanzado según lo que necesitas.' },
  { emoji: '💬', title: 'Cuéntanos de tu negocio',  desc: 'Un formulario corto con tus datos y lo que ofreces.' },
  { emoji: '💳', title: 'Pagas el setup',            desc: 'Un solo cobro inicial con IVA: setup + primer mes.' },
  { emoji: '📸', title: 'Nos mandas tu logo',        desc: 'Por WhatsApp: logo, fotos y colores de tu negocio.' },
  { emoji: '🚀', title: 'Tu página está lista',      desc: 'Te avisamos, revisas y queda lista. Sin tecnicismos.' },
];

function PlanCard({ plan, featured, isAnnual }) {
  return (
    <div
      className="soft-card"
      style={{
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        border: featured ? '2px solid var(--purple)' : '1px solid var(--border)',
        position: 'relative',
      }}
    >
      {featured && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--purple)', color: 'white',
          padding: '4px 18px', borderRadius: 999,
          fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap',
        }}>
          Recomendado
        </div>
      )}

      <h3 style={{ margin: '0 0 6px', fontSize: '1.4rem', color: 'var(--text-strong)' }}>
        {plan.name}
      </h3>

      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-strong)' }}>{plan.setup}</span>
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: 6 }}>setup único</span>
        <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>
          {isAnnual ? (
            <><span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{plan.annual}</span> · {plan.annualNote}</>
          ) : (
            <>+ {plan.monthly} de hosting</>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--bg-soft)', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 2 }}>Cobro inicial (con IVA)</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--purple)' }}>{plan.iva} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>MXN</span></div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>Entrega en {plan.days} días hábiles</div>
      </div>

      <ul style={{ flex: 1, margin: '0 0 28px', padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
        {plan.includes.map(item => (
          <li key={item} style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--text)' }}>
            <span style={{ color: 'var(--green)', fontWeight: 800, flexShrink: 0 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <a
        href={`/paginas-web/contratar?plan=${plan.id}`}
        className={`btn ${featured ? 'btn-primary' : 'btn-light'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Comenzar →
      </a>
    </div>
  );
}

export default function WebServiceOrder() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(247,248,252,0.95)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={ankodeLogo} alt="ankode" style={{ height: 32, width: 'auto' }} />
          </a>
          <a href="/" className="btn btn-light" style={{ fontSize: '0.88rem', height: 40 }}>
            ← Volver al inicio
          </a>
        </div>
      </div>

      <div className="site-shell">

        {/* ── SECCIÓN 1: Hero ── */}
        <section style={{
          padding: '72px 28px 80px',
          background: '#111827',
          borderRadius: 42,
          textAlign: 'center',
          margin: '32px 0 0',
        }}>
          <p className="eyebrow" style={{ color: 'var(--purple)' }}>— PÁGINAS WEB</p>
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
            letterSpacing: '-0.04em',
            margin: '0 0 20px',
            color: 'white',
            lineHeight: 1.05,
          }}>
            Tu negocio en internet,<br />sin rollos
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Te armamos una página profesional en 5 días. Tú nos cuentas de tu negocio, nosotros hacemos el resto.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 16,
            maxWidth: 820,
            margin: '0 auto 48px',
          }}>
            {[
              { num: '5',    desc: 'Días hábiles de entrega (básico)' },
              { num: '$0',   desc: 'Costo extra de infraestructura para ti' },
              { num: '2.9%', desc: 'Comisión Openpay (plan avanzado)' },
              { num: '∞',    desc: 'Cambios el primer mes incluidos' },
            ].map(stat => (
              <div key={stat.num} style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: '24px 16px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--purple)', lineHeight: 1 }}>{stat.num}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginTop: 10, lineHeight: 1.4 }}>{stat.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/paginas-web/contratar?plan=basico" className="btn btn-light" style={{ fontSize: '1rem', height: 52, padding: '0 28px' }}>
              Quiero el plan Básico →
            </a>
            <a href="/paginas-web/contratar?plan=avanzado" className="btn btn-primary" style={{ fontSize: '1rem', height: 52, padding: '0 28px' }}>
              Quiero el plan Avanzado →
            </a>
          </div>
        </section>

        {/* ── SECCIÓN 2: Planes ── */}
        <section className="section" id="planes">
          <div className="section-heading center">
            <p className="eyebrow">Planes</p>
            <h2>Elige el que le queda a tu negocio.</h2>
            <p>Sin permanencia forzada. Puedes cambiar de plan después.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 36 }}>
            <span style={{ fontSize: '0.95rem', fontWeight: isAnnual ? 500 : 700, color: isAnnual ? 'var(--muted)' : 'var(--text-strong)' }}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(prev => !prev)}
              aria-label="Cambiar entre pago mensual y anual"
              style={{
                width: 52, height: 28, borderRadius: 999,
                border: 'none', cursor: 'pointer',
                background: isAnnual ? 'var(--purple)' : 'var(--border)',
                position: 'relative', transition: '0.2s ease',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 4,
                left: isAnnual ? 28 : 4,
                width: 20, height: 20, borderRadius: '50%',
                background: 'white', transition: '0.2s ease',
                display: 'block',
              }} />
            </button>
            <span style={{ fontSize: '0.95rem', fontWeight: isAnnual ? 700 : 500, color: isAnnual ? 'var(--text-strong)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Anual
              <span style={{ background: 'var(--green-soft)', color: '#0d8f59', fontSize: '0.78rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999 }}>
                2 meses gratis
              </span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28, maxWidth: 860, margin: '0 auto' }}>
            <PlanCard plan={BASICO} featured={false} isAnnual={isAnnual} />
            <PlanCard plan={AVANZADO} featured={true} isAnnual={isAnnual} />
          </div>
        </section>

        {/* ── SECCIÓN 3: Cómo funciona ── */}
        <section className="section section-soft">
          <div className="section-heading center">
            <p className="eyebrow">¿Cómo funciona?</p>
            <h2>De cero a publicada en pocos días.</h2>
            <p>Sin reuniones largas ni tecnicismos. Así es el proceso.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={step.title} className="step-card" style={{ padding: 22 }}>
                <div className="step-number">{i + 1}</div>
                <div style={{ fontSize: '1.5rem', margin: '12px 0 10px' }}>{step.emoji}</div>
                <strong style={{ display: 'block', marginBottom: 8, color: 'var(--text-strong)', fontSize: '0.95rem' }}>
                  {step.title}
                </strong>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECCIÓN FAQ ── */}
        <section className="section" id="faq-web">
          <div className="section-heading center">
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2>Lo que más nos preguntan</h2>
            <p>Si tienes otra duda, escríbenos por WhatsApp y te respondemos rápido.</p>
          </div>
          <div className="faq-list">
            {[
              {
                q: '¿Cuánto tiempo tarda en estar lista mi página?',
                a: 'El plan Básico se entrega en 5 días hábiles y el Avanzado en 15. El reloj empieza cuando nos mandas tu logo, fotos y la info de tu negocio. Si tardas en enviarnos los materiales, los tiempos se recorren.',
              },
              {
                q: '¿Qué pasa si no me gusta el diseño?',
                a: 'El primer mes puedes pedirnos los cambios que necesites sin costo extra. Ajustamos colores, textos, fotos, secciones — lo que haga falta. Queremos que quedes contento.',
              },
              {
                q: '¿El dominio queda a mi nombre?',
                a: 'Sí, 100%. El dominio .com.mx que incluye el plan Avanzado queda registrado a nombre de tu negocio o el que indiques. Tú eres el dueño, no nosotros.',
              },
              {
                q: '¿Puedo cancelar en cualquier momento?',
                a: 'Sí, sin permanencia forzada. El setup es un pago único y el hosting es mes a mes. Si decides cancelar, solo avísanos con un mes de anticipación y listo, sin penalizaciones.',
              },
              {
                q: '¿Qué necesito para empezar?',
                a: 'Solo tres cosas: llenar el formulario de tu negocio, hacer el pago del setup y mandarnos tu logo o imagen por WhatsApp. Nosotros hacemos el resto.',
              },
            ].map(item => (
              <details key={item.q} className="faq-card">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── SECCIÓN 4: CTA final ── */}
        <section className="section">
          <div className="cta-panel">
            <h2>¿Listo para tener tu página?</h2>
            <p style={{ maxWidth: 480, margin: '16px auto 28px' }}>
              Empieza hoy. En menos de una semana tu negocio ya tiene presencia en internet.
            </p>
            <div className="hero-actions center-actions">
              <a href="/paginas-web/contratar?plan=avanzado" className="btn btn-primary" style={{ fontSize: '1rem', height: 52, padding: '0 32px' }}>
                Comenzar con Avanzado →
              </a>
              <a href="/paginas-web/contratar?plan=basico" className="btn btn-light" style={{ fontSize: '1rem', height: 52 }}>
                Ver plan Básico
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
