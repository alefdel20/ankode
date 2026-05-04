import { useState } from 'react';
import { PLANS, TERMS } from '../constants/plans';

const digitalPlans = PLANS.filter((p) => ['basico', 'premium', 'enterprise', 'all-inclusive'].includes(p.id));
const hardwarePlans = PLANS.filter((p) => ['starter', 'duo', 'pro-caja'].includes(p.id));

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
  const [hardwareMode, setHardwareMode] = useState('contado');

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

      {plan.hardware && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {['contado', 'financiado'].map((mode) => (
              <button
                key={mode}
                onClick={() => setHardwareMode(mode)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 999,
                  border: `2px solid ${hardwareMode === mode ? 'var(--purple)' : 'var(--border)'}`,
                  background: hardwareMode === mode ? 'rgba(109,74,255,0.06)' : 'transparent',
                  color: hardwareMode === mode ? 'var(--purple)' : 'var(--muted)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: '0.15s ease',
                }}
              >
                {mode === 'contado' ? 'Mensual' : 'Financiado (12 meses)'}
              </button>
            ))}
          </div>
          {hardwareMode === 'contado' ? (
            <div style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Hardware incluido en el plan mensual.
            </div>
          ) : (
            <div style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Sin pago inicial · <strong style={{ color: 'var(--text)' }}>$1,682/mes</strong> los primeros 12 meses, luego <strong style={{ color: 'var(--text)' }}>$1,299/mes</strong>
            </div>
          )}
        </div>
      )}

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

function HardwareCard({ plan, isAnnual, onSelectPlan, onAddToCart }) {
  const [planTier, setPlanTier] = useState('basico');

  const isPremium = planTier === 'premium';
  const displayMonthly = isPremium ? 699 : plan.monthlyPrice;
  const displayAnnual = isPremium ? 6990 : plan.annualPrice;
  const displayAnnualSaving = isPremium ? 1398 : plan.annualSaving;

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: 28,
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>{plan.name}</div>
      <div style={{ color: 'var(--purple)', fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>
        {plan.hardware.description}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {['basico', 'premium', 'enterprise'].map(tier => (
          <button
            key={tier}
            type="button"
            onClick={() => setPlanTier(tier)}
            style={{
              background: planTier === tier ? 'var(--purple)' : 'var(--bg-soft)',
              color: planTier === tier ? 'white' : 'var(--muted)',
              borderRadius: 999,
              padding: '4px 14px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: '0.15s ease',
            }}
          >
            {tier === 'basico' ? 'Plan Básico · $349/mes' : tier === 'premium' ? 'Plan Premium · $699/mes' : 'Plan Enterprise · $999/mes'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--purple)' }}>
          Pago inicial: ${plan.hardware.initialFee.toLocaleString('es-MX')}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>
          {isAnnual
            ? `luego $${displayAnnual.toLocaleString('es-MX')}/año`
            : `luego $${displayMonthly.toLocaleString('es-MX')}/mes`}
        </div>
        {isAnnual && (
          <span
            className="pill"
            style={{ background: 'var(--green-soft)', color: 'var(--green)', fontWeight: 700, marginTop: 8, display: 'inline-flex' }}
          >
            Ahorras ${displayAnnualSaving.toLocaleString('es-MX')} en software
          </span>
        )}
        {isPremium && (
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 8 }}>
            Incluye reportes avanzados y análisis de tendencias
          </div>
        )}
      </div>

      <FeatureList features={plan.features} />

      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, marginTop: 'auto' }}>
        Incluye {plan.includedBranches} sucursal(es) · Adicional: +${plan.extraBranchPrice}/mes
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', cursor: 'pointer', marginBottom: 10 }}
        onClick={() => onSelectPlan(planTier === 'premium' ? 'premium' : planTier === 'enterprise' ? 'enterprise' : plan.id)}
      >
        Contratar ahora
      </button>
      <button
        className="btn btn-outline"
        style={{ width: '100%', cursor: 'pointer' }}
        onClick={() => onAddToCart({ id: plan.id, name: plan.name, price: plan.hardware.initialFee, type: 'hardware', planId: plan.id })}
      >
        Agregar al carrito
      </button>
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

      <div
        style={{
          display: 'flex',
          background: 'var(--bg-soft)',
          borderRadius: 999,
          padding: 4,
          width: 'fit-content',
          margin: '0 auto 40px',
        }}
      >
        {[
          { label: 'Mensual', value: false },
          { label: 'Anual · 2 meses gratis (1er año)', value: true },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={onToggleAnnual}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 'none',
              background: isAnnual === value ? 'var(--purple)' : 'transparent',
              color: isAnnual === value ? 'white' : 'var(--muted)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: '0.15s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Digital plans */}
      <div style={{ marginBottom: 56 }}>
        <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 24 }}>Planes digitales</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
          {digitalPlans.map((plan) => (
            <DigitalCard key={plan.id} plan={plan} isAnnual={isAnnual} onSelectPlan={onSelectPlan} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>

      {/* Hardware plans */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Planes con hardware</p>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0 }}>
            Incluyen las funciones del plan Básico más equipo físico para tu negocio.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
          {hardwarePlans.map((plan) => (
            <HardwareCard key={plan.id} plan={plan} isAnnual={isAnnual} onSelectPlan={onSelectPlan} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>

    </section>
  );
}
