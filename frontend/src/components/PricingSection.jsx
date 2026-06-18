import { PLANS, TERMS } from '../constants/plans';

const digitalPlans = PLANS.filter((p) => ['basico', 'premium', 'enterprise'].includes(p.id));

function FeatureList({ features }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {features.map((f) => (
        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.93rem', color: 'var(--text)' }}>
          <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
          {f}
        </li>
      ))}
    </ul>
  );
}

function DigitalCard({ plan, isAnnual, onSelectPlan, onAddToCart }) {
  const badgeBg = plan.badge === 'Más popular' ? 'var(--green)' : 'var(--purple)';
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const priceLabel = isAnnual
    ? `$${plan.annualPrice.toLocaleString('es-MX')}/año`
    : `$${plan.monthlyPrice.toLocaleString('es-MX')}/mes`;
  const equivMonthly = Math.round(plan.annualPrice / 12);

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: 28,
        boxShadow: 'var(--shadow)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {plan.badge && (
        <span
          className="pill"
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: badgeBg,
            color: 'white',
            whiteSpace: 'nowrap',
          }}
        >
          {plan.badge}
        </span>
      )}

      <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>{plan.name}</div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--purple)', lineHeight: 1.1 }}>
          {priceLabel}
        </div>
        {isAnnual && (
          <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 2 }}>
            equiv. ${equivMonthly.toLocaleString('es-MX')}/mes
          </div>
        )}
        {isAnnual && (
          <>
            <span
              className="pill"
              style={{ background: 'var(--green-soft)', color: 'var(--green)', fontWeight: 700, marginTop: 8, display: 'inline-flex' }}
            >
              Ahorras ${plan.annualSaving.toLocaleString('es-MX')}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginTop: 4 }}>
              Solo el primer año
            </span>
          </>
        )}
      </div>

      <FeatureList features={plan.features} />

      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, marginTop: 'auto' }}>
        Incluye {plan.includedBranches} sucursal(es) · Adicional: +${plan.extraBranchPrice}/mes
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', cursor: 'pointer', marginBottom: 10 }}
        onClick={() => onSelectPlan(plan.id)}
      >
        Contratar ahora
      </button>
      <button
        className="btn btn-outline"
        style={{ width: '100%', cursor: 'pointer' }}
        onClick={() => onAddToCart({ id: plan.id, name: plan.name, price: plan.monthlyPrice, type: 'plan' })}
      >
        Agregar al carrito
      </button>

      {plan.renewalNote && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 14, marginBottom: 0, lineHeight: 1.5, textAlign: 'center' }}>
          {plan.renewalNote}
        </p>
      )}
    </div>
  );
}

export default function PricingSection({ onSelectPlan, onAddToCart, isAnnual, onToggleAnnual }) {
  return (
    <section id="planes" className="section">
      <div className="section-heading center">
        <p className="eyebrow">Planes y precios</p>
        <h2>El plan correcto para tu negocio.</h2>
        <p>
          Todos los planes incluyen acceso completo a la plataforma web y soporte técnico.
          Cancela cuando quieras.
        </p>
      </div>

      <div className="billing-toggle">
        {[
          { label: 'Mensual', value: false },
          { label: 'Anual · 2 meses gratis (1er año)', value: true },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={onToggleAnnual}
            style={{
              background: isAnnual === value ? 'var(--purple)' : 'transparent',
              color: isAnnual === value ? 'white' : 'var(--muted)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="pricing-grid">
          {digitalPlans.map((plan) => (
            <DigitalCard key={plan.id} plan={plan} isAnnual={isAnnual} onSelectPlan={onSelectPlan} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>

    </section>
  );
}
