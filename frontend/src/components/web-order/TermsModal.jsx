import { useState } from 'react';

const PLAN_INFO = {
  basico:   { name: 'Básico',   setup: '$1,990', hosting: '$299/mes',  iva: '$2,655.24', days: '5'  },
  avanzado: { name: 'Avanzado', setup: '$6,990', hosting: '$499/mes',  iva: '$8,668.84', days: '15' },
};

export default function TermsModal({ plan, onAccept, loading }) {
  const [checked, setChecked] = useState(false);
  const info = PLAN_INFO[plan] || PLAN_INFO.basico;

  return (
    <div className="soft-card" style={{ maxWidth: 540, margin: '0 auto', padding: '36px 40px' }}>
      <p className="eyebrow">Paso 1 de 3</p>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.8rem', letterSpacing: '-0.03em', color: 'var(--text-strong)' }}>
        Tu página web {info.name}
      </h2>
      <p style={{ margin: '0 0 28px', color: 'var(--muted)' }}>
        Revisa el resumen antes de continuar.
      </p>

      <div style={{ background: 'var(--bg-soft)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
        {[
          ['Plan',              `Página Web ${info.name}`],
          ['Setup (pago único)', `${info.setup} MXN`],
          ['Hosting mensual',    `${info.hosting} MXN`],
          ['Entrega estimada',   `${info.days} días hábiles`],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.92rem' }}>
            <span style={{ color: 'var(--muted)' }}>{label}</span>
            <strong style={{ color: 'var(--text-strong)' }}>{value}</strong>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>Cobro inicial (con IVA)</span>
          <strong style={{ color: 'var(--purple)', fontSize: '1.1rem' }}>{info.iva} MXN</strong>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 28 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--purple)', flexShrink: 0 }}
        />
        <span style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.55 }}>
          He leído y acepto los{' '}
          <a href="/legal?doc=terms" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>
            términos y condiciones
          </a>{' '}y el{' '}
          <a href="/legal?doc=privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>
            aviso de privacidad
          </a>
          . Entiendo que el cobro inicial incluye el setup más el primer mes de hosting.
        </span>
      </label>

      <button
        className="btn btn-primary"
        style={{
          width: '100%',
          cursor: checked && !loading ? 'pointer' : 'not-allowed',
          opacity: checked && !loading ? 1 : 0.5,
        }}
        disabled={!checked || loading}
        onClick={onAccept}
      >
        {loading ? 'Procesando...' : 'Aceptar y continuar →'}
      </button>
    </div>
  );
}
