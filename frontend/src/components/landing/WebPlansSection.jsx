const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    tag: 'Ideal para empezar',
    setup: '$1,990',
    hosting: '$299/mes  ·  $2,490/año',
    iva: '$2,655.24',
    delivery: '5 días hábiles',
    includes: [
      'Hasta 3 secciones',
      'Diseño con identidad visual',
      'Horarios y mapa',
      'Catálogo hasta 12 items',
      'Botón de WhatsApp',
      'SSL incluido',
      'Subdominio ankode.cloud',
    ],
    excludes: [
      'Dominio propio',
      'Pagos en línea',
      'Tienda o reservaciones',
    ],
    cta: 'Comenzar con básico',
    accent: 'var(--purple)',
  },
  {
    id: 'avanzado',
    name: 'Avanzado',
    tag: 'Más funciones, más alcance',
    setup: '$6,990',
    hosting: '$499/mes  ·  $4,990/año',
    iva: '$8,668.84',
    delivery: '15 días hábiles',
    includes: [
      'Todo lo del plan Básico',
      'Dominio .com.mx (año 1)',
      'Tienda en línea o reservaciones',
      'Pagos con tarjeta y SPEI (Openpay)',
      'SEO básico',
      'Google Analytics',
      'Galería de fotos',
      'Testimonios y formulario de contacto',
    ],
    excludes: [],
    cta: 'Comenzar con avanzado',
    accent: 'var(--green)',
  },
];

export default function WebPlansSection() {
  return (
    <section id="paginas-web" className="section">
      <div className="section-heading center">
        <p className="eyebrow">Páginas web</p>
        <h2>Tu página lista antes de que te des cuenta.</h2>
        <p>
          Sin rollos técnicos, sin esperar semanas, sin pagar de más.
        </p>
      </div>

      <div className="web-plans-grid web-plans-grid--wide">
        {PLANS.map(plan => (
          <article
            key={plan.id}
            className="soft-card"
            style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 999,
                background: plan.id === 'avanzado' ? 'var(--green-soft)' : 'rgba(109,74,255,0.1)',
                color: plan.accent,
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: 10,
              }}>
                {plan.tag}
              </span>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: 'var(--text-strong)' }}>
                Plan {plan.name}
              </h3>
              <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Setup único: <strong style={{ color: 'var(--text-strong)' }}>{plan.setup} MXN</strong></div>
              <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 2 }}>Hosting: <strong style={{ color: 'var(--text-strong)' }}>{plan.hosting}</strong></div>
            </div>

            {/* Cobro inicial */}
            <div style={{ background: 'var(--bg-soft)', borderRadius: 14, padding: '14px 18px', marginBottom: 24 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 2 }}>Cobro inicial (setup + 1er mes, con IVA)</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: plan.accent, lineHeight: 1.1 }}>
                {plan.iva} <span style={{ fontSize: '1rem', fontWeight: 600 }}>MXN</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>Entrega en {plan.delivery}</div>
            </div>

            {/* Incluye */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Incluye
              </div>
              <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                {plan.includes.map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--text)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {plan.excludes.length > 0 && (
                <>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    No incluye
                  </div>
                  <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                    {plan.excludes.map(item => (
                      <li key={item} style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--muted)' }}>
                        <span style={{ flexShrink: 0 }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* CTA */}
            <a
              href={`/paginas-web?plan=${plan.id}`}
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: plan.excludes.length === 0 ? 24 : 0,
                background: plan.id === 'avanzado' ? 'var(--green)' : 'var(--purple)',
                justifyContent: 'center',
              }}
            >
              {plan.cta} →
            </a>
          </article>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem', marginTop: 20 }}>
        ¿Tienes dudas? Escríbenos al{' '}
        <a
          href="https://wa.me/525515133527?text=Hola%2C%20quiero%20info%20sobre%20las%20p%C3%A1ginas%20web%20de%20ankode"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--purple)', fontWeight: 700 }}
        >
          WhatsApp
        </a>{' '}
        y con gusto te orientamos.
      </p>
    </section>
  );
}
