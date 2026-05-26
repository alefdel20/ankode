import { useEffect, useState } from 'react';
import { loadOpenpayScripts, tokenizeCard } from '../../services/openpayService';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ankode.cloud';

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

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function WebPaymentStep({ orderId, plan, amount }) {
  const [ready, setReady] = useState(false);
  const [loadErr, setLoadErr] = useState(null);
  const [cardData, setCardData] = useState({
    name: '', number: '', expMonth: '', expYear: '', cvv: '', email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOpenpayScripts()
      .then(() => setReady(true))
      .catch(() => setLoadErr('No se pudo cargar el procesador de pagos. Recarga la página e intenta de nuevo.'));
  }, []);

  const set = (field) => (e) => setCardData(prev => ({ ...prev, [field]: e.target.value }));
  const setNumeric = (field, max) => (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, max);
    setCardData(prev => ({ ...prev, [field]: val }));
  };

  const handlePay = async () => {
    if (loading || !ready) return;
    setLoading(true);
    setError(null);

    try {
      if (!window.OpenPay?.token) throw new Error('El procesador de pagos no está listo. Recarga la página.');

      const deviceSessionId = window.OpenPay.deviceData.setup();
      const cleanNumber = cardData.number.replace(/\D/g, '');
      const cleanYear = cardData.expYear.length === 4 ? cardData.expYear.slice(2) : cardData.expYear;

      const tokenResponse = await tokenizeCard({
        card_number: cleanNumber,
        expiration_month: String(cardData.expMonth).padStart(2, '0'),
        expiration_year: cleanYear,
        cvv2: cardData.cvv,
        holder_name: cardData.name,
      });
      const token_id = tokenResponse.data.id;

      const response = await fetch(`${API_BASE}/api/web-services/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_id, device_session_id: deviceSessionId, email: cardData.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Error al procesar el pago');

      if (data.requires3DS && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      window.location.href = `/paginas-web/gracias?order_id=${orderId}`;
    } catch (err) {
      const lower = (err.message || '').toLowerCase();
      const errCode = err.error_code || err.openpayCode || null;
      const isFraud = lower.includes('fraud') || lower.includes('anti-fraud') || errCode === 3005;
      const isDeclined = lower.includes('fondos') || lower.includes('insufficient') || errCode === 3004;
      setError(
        isFraud ? 'La transacción falló. Intenta con otra tarjeta.' :
        isDeclined ? 'Tarjeta declinada. Intenta con otra tarjeta.' :
        (err.message || 'Ocurrió un error. Intenta de nuevo.')
      );
      setCardData(prev => ({ ...prev, cvv: '' }));
      setLoading(false);
    }
  };

  if (loadErr) {
    return (
      <div className="soft-card" style={{ maxWidth: 540, margin: '0 auto', padding: '36px 40px', textAlign: 'center' }}>
        <p style={{ color: '#dc2626' }}>{loadErr}</p>
      </div>
    );
  }

  return (
    <div className="soft-card" style={{ maxWidth: 540, margin: '0 auto', padding: '36px 40px' }}>
      <p className="eyebrow">Paso 3 de 3</p>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.8rem', letterSpacing: '-0.03em', color: 'var(--text-strong)' }}>
        Datos de pago
      </h2>
      <p style={{ margin: '0 0 24px', color: 'var(--muted)' }}>
        Tu tarjeta es tokenizada por Openpay. Nosotros nunca almacenamos tus datos.
      </p>

      {/* Total */}
      <div style={{ background: 'var(--bg-soft)', borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Cobro inicial (con IVA)</span>
        <strong style={{ color: 'var(--purple)', fontSize: '1.2rem' }}>
          ${amount.toLocaleString('es-MX')} MXN
        </strong>
      </div>

      {/* Card brands */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginRight: 4 }}>Aceptamos:</span>
        <span style={{ background: '#1a1f71', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1 }}>VISA</span>
        <span style={{ background: '#eb001b', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>MC</span>
        <span style={{ background: '#2e77bc', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>AMEX</span>
      </div>

      <Field label="Nombre en tarjeta">
        <input
          type="text"
          placeholder="Como aparece en la tarjeta"
          value={cardData.name}
          onChange={set('name')}
          style={inputStyle}
          autoComplete="cc-name"
        />
      </Field>

      <Field label="Número de tarjeta">
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={cardData.number}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
            setCardData(prev => ({ ...prev, number: val }));
          }}
          style={inputStyle}
          autoComplete="cc-number"
          inputMode="numeric"
          maxLength={16}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Field label="Mes venc.">
          <input
            type="text"
            placeholder="MM"
            value={cardData.expMonth}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 2);
              if (val === '' || Number(val) <= 12) setCardData(prev => ({ ...prev, expMonth: val }));
            }}
            style={inputStyle}
            autoComplete="cc-exp-month"
            maxLength={2}
            inputMode="numeric"
          />
        </Field>
        <Field label="Año venc.">
          <input
            type="text"
            placeholder="AA"
            value={cardData.expYear}
            onChange={setNumeric('expYear', 2)}
            style={inputStyle}
            autoComplete="cc-exp-year"
            maxLength={2}
            inputMode="numeric"
          />
        </Field>
        <Field label="CVV">
          <input
            type="text"
            placeholder="•••"
            value={cardData.cvv}
            onChange={setNumeric('cvv', 4)}
            style={inputStyle}
            autoComplete="cc-csc"
            maxLength={4}
            inputMode="numeric"
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          type="email"
          placeholder="tu@correo.com"
          value={cardData.email}
          onChange={set('email')}
          style={inputStyle}
          autoComplete="email"
        />
      </Field>

      {/* Openpay badge */}
      <div style={{ background: 'var(--bg-soft)', borderRadius: 12, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 28" height="20" aria-label="Openpay">
          <circle cx="12" cy="14" r="10" fill="#00b3e6" />
          <circle cx="12" cy="14" r="5" fill="white" />
          <text x="26" y="19" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="15" fill="#00b3e6">openpay</text>
        </svg>
        <span>🔒 Tu tarjeta es tokenizada por Openpay. Ankode nunca almacena tus datos de pago.</span>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 12, padding: '10px 14px', marginBottom: 12, fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        style={{
          width: '100%',
          cursor: loading || !ready ? 'not-allowed' : 'pointer',
          opacity: loading || !ready ? 0.7 : 1,
        }}
        disabled={loading || !ready}
        onClick={handlePay}
      >
        {loading ? 'Procesando...' : `Pagar $${amount.toLocaleString('es-MX')} MXN →`}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
        Al pagar aceptas nuestros{' '}
        <a href="/legal?doc=webTerms" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>términos y condiciones</a>{' '}y{' '}
        <a href="/legal?doc=privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>aviso de privacidad</a>.
      </p>
    </div>
  );
}
