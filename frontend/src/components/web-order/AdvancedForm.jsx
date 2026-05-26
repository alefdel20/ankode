import { useState } from 'react';

const inputStyle = {
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '12px 14px',
  width: '100%',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  color: 'var(--text)',
  background: 'white',
};

const labelStyle = {
  display: 'block',
  fontWeight: 700,
  fontSize: '0.88rem',
  marginBottom: 6,
  color: 'var(--text-strong)',
};

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--purple)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {options.map(opt => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '9px 16px',
              borderRadius: 999,
              border: `2px solid ${selected ? 'var(--purple)' : 'var(--border)'}`,
              background: selected ? 'rgba(109,74,255,0.06)' : 'white',
              color: selected ? 'var(--purple)' : 'var(--text)',
              fontWeight: selected ? 700 : 400,
              fontSize: '0.9rem',
              transition: '0.15s ease',
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              style={{ display: 'none' }}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

const REQUIRED = [
  'business_name', 'giro', 'address', 'phone', 'schedule',
  'catalog', 'domain', 'functionality', 'description', 'contact_email',
];

export default function AdvancedForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    business_name: '', giro: '', address: '', phone: '', schedule: '',
    social: '', catalog: '', style: '',
    domain: '', functionality: '', description: '', testimonials: '', uses_pos: '', contact_email: '',
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const setDirect = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }));
  const isValid = REQUIRED.every(f => form[f].trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    onSubmit(form);
  };

  return (
    <div className="soft-card" style={{ maxWidth: 580, margin: '0 auto', padding: '36px 40px' }}>
      <p className="eyebrow">Paso 2 de 3</p>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.8rem', letterSpacing: '-0.03em', color: 'var(--text-strong)' }}>
        Cuéntanos de tu negocio
      </h2>
      <p style={{ margin: '0 0 28px', color: 'var(--muted)' }}>
        Con esto armamos tu página completa. Entre más detalle, mejor queda.
      </p>

      <form onSubmit={handleSubmit}>
        {/* ── Campos básicos ── */}
        <Field label="Nombre del negocio" required>
          <input type="text" placeholder="Ej. Ferretería El Tornillo" value={form.business_name} onChange={set('business_name')} style={inputStyle} />
        </Field>

        <Field label="Giro del negocio" required>
          <select value={form.giro} onChange={set('giro')} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="" disabled>Selecciona tu giro</option>
            {['Restaurante', 'Tienda', 'Clínica', 'Servicio', 'Otro'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>

        <Field label="Dirección completa" required>
          <input type="text" placeholder="Calle, número, colonia, ciudad" value={form.address} onChange={set('address')} style={inputStyle} />
        </Field>

        <Field label="Teléfono / WhatsApp" required>
          <input type="tel" placeholder="55 1234 5678" value={form.phone} onChange={set('phone')} style={inputStyle} />
        </Field>

        <Field label="Horario de atención" required>
          <input type="text" placeholder="Lun-Vie 9am-7pm, Sáb 9am-3pm" value={form.schedule} onChange={set('schedule')} style={inputStyle} />
        </Field>

        <Field label="Redes sociales">
          <input type="text" placeholder="@tunegocio en Instagram, Facebook, etc." value={form.social} onChange={set('social')} style={inputStyle} />
        </Field>

        <Field label="Catálogo o menú" required hint="Lista hasta 12 productos o servicios. Puedes incluir precios.">
          <textarea
            placeholder={"Ej:\n- Tacos de canasta $15\n- Tortas $35\n- Refrescos $20"}
            value={form.catalog}
            onChange={set('catalog')}
            style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
          />
        </Field>

        <Field label="Estilo o colores preferidos">
          <input type="text" placeholder="Ej. Colores cálidos, moderno, minimalista" value={form.style} onChange={set('style')} style={inputStyle} />
        </Field>

        {/* ── Campos exclusivos del plan Avanzado ── */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0 20px', paddingTop: 20 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Información adicional</p>
        </div>

        <Field label="Dominio deseado (.com.mx)" required hint="Solo el nombre, sin www. Ej: minegocio">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <input
              type="text"
              placeholder="minegocio"
              value={form.domain}
              onChange={set('domain')}
              style={{ ...inputStyle, borderRadius: '12px 0 0 12px', borderRight: 'none' }}
            />
            <span style={{ padding: '12px 14px', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: '0 12px 12px 0', color: 'var(--muted)', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
              .com.mx
            </span>
          </div>
        </Field>

        <Field label="Tipo de funcionalidad" required>
          <RadioGroup
            name="functionality"
            value={form.functionality}
            onChange={setDirect('functionality')}
            options={[
              { value: 'tienda',   label: 'Tienda en línea' },
              { value: 'reservas', label: 'Reservaciones' },
              { value: 'ambas',    label: 'Ambas' },
            ]}
          />
        </Field>

        <Field label="Descripción de tu negocio" required>
          <textarea
            placeholder="Cuéntanos qué haces, a quién le vendes y qué te hace diferente."
            value={form.description}
            onChange={set('description')}
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
          />
        </Field>

        <Field label="Testimonios o reseñas">
          <textarea
            placeholder="Copia aquí reseñas de clientes o escribe las que quieras destacar."
            value={form.testimonials}
            onChange={set('testimonials')}
            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
          />
        </Field>

        <Field label="¿Usas POS Ankode?">
          <RadioGroup
            name="uses_pos"
            value={form.uses_pos}
            onChange={setDirect('uses_pos')}
            options={[
              { value: 'si',          label: 'Sí' },
              { value: 'no',          label: 'No' },
              { value: 'me_interesa', label: 'Me interesa' },
            ]}
          />
        </Field>

        <Field label="Email de contacto" required hint="Te avisamos cuando tu página esté lista.">
          <input type="email" placeholder="tu@correo.com" value={form.contact_email} onChange={set('contact_email')} style={inputStyle} autoComplete="email" />
        </Field>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: '100%',
            marginTop: 8,
            cursor: isValid && !loading ? 'pointer' : 'not-allowed',
            opacity: isValid && !loading ? 1 : 0.5,
          }}
          disabled={!isValid || loading}
        >
          {loading ? 'Guardando...' : 'Continuar al pago →'}
        </button>
      </form>
    </div>
  );
}
