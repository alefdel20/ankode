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

const REQUIRED = ['business_name', 'giro', 'address', 'phone', 'schedule', 'catalog'];

export default function BasicForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    business_name: '', giro: '', address: '', phone: '',
    schedule: '', social: '', catalog: '', style: '',
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const isValid = REQUIRED.every(f => form[f].trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    onSubmit(form);
  };

  return (
    <div className="soft-card" style={{ maxWidth: 560, margin: '0 auto', padding: '36px 40px' }}>
      <p className="eyebrow">Paso 2 de 3</p>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.8rem', letterSpacing: '-0.03em', color: 'var(--text-strong)' }}>
        Cuéntanos de tu negocio
      </h2>
      <p style={{ margin: '0 0 28px', color: 'var(--muted)' }}>
        Con esto armamos tu página. Entre más detalle, mejor queda.
      </p>

      <form onSubmit={handleSubmit}>
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
            style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }}
          />
        </Field>

        <Field label="Estilo o colores preferidos">
          <input type="text" placeholder="Ej. Colores cálidos, moderno, minimalista, azul y blanco" value={form.style} onChange={set('style')} style={inputStyle} />
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
