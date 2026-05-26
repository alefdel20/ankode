const WEB_STEPS = [
  { emoji: '📋', title: 'Elige tu plan', desc: 'Básico o Avanzado según lo que necesitas. Sin compromisos raros.' },
  { emoji: '💬', title: 'Cuéntanos de tu negocio', desc: 'Llenás un formulario corto con los datos de tu negocio, horarios y lo que ofreces.' },
  { emoji: '💳', title: 'Pagas el setup', desc: 'Un solo cobro inicial que incluye el setup y el primer mes de hosting, con IVA.' },
  { emoji: '📸', title: 'Nos mandas tu logo y fotos', desc: 'Por WhatsApp nos compartes tu logo, fotos del negocio y cualquier referencia de estilo.' },
  { emoji: '🚀', title: 'Tu página está lista', desc: 'Te avisamos cuando esté publicada. Revisas, nos dices si le falta algo y listo.' },
];

export default function HowItWorks() {
  return (
    <section className="section section-soft">
      <div className="section-heading center">
        <p className="eyebrow">¿Cómo funciona?</p>
        <h2>De cero a publicada en pocos días.</h2>
        <p>Sin tecnicismos, sin reuniones interminables. Así es el proceso.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 16 }}>
        {WEB_STEPS.map((step, i) => (
          <div key={step.title} className="step-card" style={{ padding: 22 }}>
            <div className="step-number">{i + 1}</div>
            <div style={{ fontSize: '1.6rem', margin: '12px 0 10px' }}>{step.emoji}</div>
            <strong style={{ display: 'block', marginBottom: 8, color: 'var(--text-strong)', fontSize: '0.97rem' }}>
              {step.title}
            </strong>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
