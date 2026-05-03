import { useEffect, useState } from 'react';
import { PLANS } from '../constants/plans';
import { loadOpenpayScripts, tokenizeCard, submitCheckout } from '../services/openpayService';

const inputStyle = {
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 12,
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
  color: 'var(--text)',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function CheckoutModal({ isOpen, onClose, selectedPlan, isAnnual, onSubmitPayment, cart = [] }) {
  const [extraBranches, setExtraBranches] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({ name: '', number: '', expMonth: '', expYear: '', cvv: '', email: '', businessName: '', businessType: '', password: '' });
  const [speiEmail, setSpeiEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadOpenpayScripts().catch(err => console.error('Openpay scripts failed to load:', err));
    }
  }, [isOpen]);

  // Reset result when modal reopens
  useEffect(() => {
    if (isOpen) setResult(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const isCartMode = selectedPlan === 'cart';
  const hasOnlyAccessories = cart.length > 0 && cart.every(item => item.type === 'accessory');

  const plan = isCartMode
    ? null
    : (PLANS.find((p) => p.id === selectedPlan) ?? null);

  if (!isCartMode && !plan) return null;

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const basePrice = plan ? (isAnnual ? plan.annualPrice : plan.monthlyPrice) : 0;
  const total = isCartMode ? cartTotal : basePrice + extraBranches * (plan.extraBranchPrice ?? 0);

  const handleCardChange = (field) => (e) =>
    setCardData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleNumericChange = (field, maxLen) => (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, maxLen);
    setCardData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    if (!hasOnlyAccessories && paymentMethod === 'card' && cardData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setIsLoading(false);
      return;
    }
    try {
      const planType = isAnnual ? 'yearly' : 'monthly';
      const amount = isCartMode ? cartTotal : (isAnnual ? plan.annualPrice : plan.monthlyPrice);

      let cardToken = null;
      if (paymentMethod === 'card') {
        if (!window.OpenPay || !window.OpenPay.token) {
          throw new Error('El procesador de pagos no está listo. Recarga la página e intenta de nuevo.');
        }
        console.log('CARD DATA:', JSON.stringify({ number: cardData.number, expMonth: cardData.expMonth, expYear: cardData.expYear, cvv: cardData.cvv, name: cardData.name }));
        const cleanNumber = cardData.number.replace(/\D/g, '');
        const cleanYear = cardData.expYear.length === 4 ? cardData.expYear.slice(2) : cardData.expYear;
        const tokenResponse = await tokenizeCard({
          card_number: cleanNumber,
          expiration_month: String(cardData.expMonth).padStart(2, '0'),
          expiration_year: cleanYear,
          cvv2: cardData.cvv,
          holder_name: cardData.name,
        });
        cardToken = tokenResponse.data.id;
      }

      const deviceSessionId = paymentMethod === 'card'
        ? window.OpenPay.deviceData.setup()
        : null;

      const data = await submitCheckout({
        planType,
        amount,
        cardToken,
        email: paymentMethod === 'card' ? cardData.email : speiEmail,
        name: cardData.name || '',
        businessName: cardData.businessName || '',
        ownerName: cardData.name || '',
        password: cardData.password || '',
        posType: cardData.businessType || (isCartMode ? 'cart' : plan.id),
        planName: isCartMode ? 'Carrito' : plan.name,
        paymentMethod,
        deviceSessionId,
      });

      setIsLoading(false);

      if (data.requires3DS && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      setResult({
        total,
        planName: isCartMode ? 'Carrito' : plan.name,
        orderId: data.orderId || data.subscriptionId || null,
        clabe: data.clabe || null,
        paymentMethod,
      });
    } catch (err) {
      setIsLoading(false);
      if (err.details && Array.isArray(err.details) && err.details[0]?.msg) {
        setError(err.details[0].msg);
        setIsLoading(false);
        return;
      }
      const rawMsg = err.message || '';
      const errCode = err.error_code || err.openpayCode || null;
      const lower = rawMsg.toLowerCase();
      const isFraud = lower.includes('fraud') || lower.includes('anti-fraud') || errCode === 3005 || errCode === '3005';
      const isDeclined3004 = errCode === 3004 || errCode === '3004';
      const isDeclined = ['fondos insuficientes', 'insufficient funds', 'tarjeta reportada', 'lost card', 'stolen', 'robada', 'perdida']
        .some(p => lower.includes(p));
      const userMsg = isFraud
        ? 'La transacción falló. Intenta con otra tarjeta.'
        : (isDeclined || isDeclined3004)
          ? 'Tarjeta declinada. Intenta con otra tarjeta.'
          : (rawMsg || 'Ocurrió un error. Intenta de nuevo.');
      setError(userMsg);
      setCardData(prev => ({ ...prev, cvv: '' }));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 28,
          padding: 36,
          maxWidth: 520,
          width: 'calc(100% - 32px)',
          boxShadow: '0 24px 64px rgba(55,72,112,0.18)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: '1.4rem',
            cursor: 'pointer',
            color: 'var(--muted)',
            lineHeight: 1,
          }}
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Success screen */}
        {result ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
            <h3 style={{ margin: '0 0 8px', color: 'var(--purple)', fontSize: '1.4rem' }}>
              {result.paymentMethod === 'spei' ? '¡Orden generada!' : '¡Pago completado!'}
            </h3>
            <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '0.95rem' }}>
              {result.paymentMethod === 'spei'
                ? 'Realiza la transferencia SPEI a la CLABE que recibiste en tu correo. Tu suscripción se activará al detectarse el pago.'
                : 'Tu pago fue procesado correctamente. Revisa tu correo para recibir tus credenciales de acceso.'}
            </p>
            <div style={{ background: 'var(--bg-soft)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Plan</span>
                <span style={{ fontWeight: 700 }}>{result.planName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: result.orderId ? 8 : 0 }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Monto</span>
                <span style={{ fontWeight: 800, color: 'var(--purple)', fontSize: '1.1rem' }}>
                  ${result.total.toLocaleString('es-MX')} MXN
                </span>
              </div>
              {result.clabe && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>CLABE</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{result.clabe}</span>
                </div>
              )}
              {result.orderId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Referencia</span>
                  <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{result.orderId}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => { onSubmitPayment({ success: true }); onClose(); }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* Header — cart mode */}
            {isCartMode && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', color: 'var(--purple)', fontSize: '1.3rem' }}>
                  Resumen de compra
                </h3>
                <div style={{
                  background: 'var(--bg-soft)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 8,
                }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                      <span>{item.name} × {item.qty}</span>
                      <span style={{ color: 'var(--purple)', fontWeight: 700 }}>
                        ${(item.price * item.qty).toLocaleString('es-MX')}
                      </span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--purple)', fontSize: '1.1rem' }}>
                      ${cartTotal.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Header — normal plan mode */}
            {!isCartMode && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 4px', color: 'var(--purple)', fontSize: '1.3rem' }}>
                  {plan.name}
                </h3>
                <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  Facturación {isAnnual ? 'anual' : 'mensual'}
                </p>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple)', lineHeight: 1 }}>
                  ${basePrice.toLocaleString('es-MX')}{isAnnual ? '/año' : '/mes'}
                </div>
              </div>
            )}

            <form>
              {/* Extra branches — only in normal plan mode */}
              {!isCartMode && (
                <Field label="Sucursales adicionales">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={extraBranches === 0 ? '' : extraBranches}
                    placeholder="0"
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '' || raw === '-') {
                        setExtraBranches(0);
                        return;
                      }
                      const val = Math.floor(Number(raw));
                      setExtraBranches(isNaN(val) || val < 0 ? 0 : val);
                    }}
                    onBlur={() => {
                      if (extraBranches === '' || isNaN(extraBranches)) setExtraBranches(0);
                    }}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                  <div style={{ marginTop: 6, fontSize: '0.88rem', color: 'var(--muted)' }}>
                    Total:{' '}
                    <strong style={{ color: 'var(--purple)' }}>
                      ${total.toLocaleString('es-MX')}{isAnnual ? '/año' : '/mes'}
                    </strong>
                    {extraBranches > 0 && (
                      <span> (+{extraBranches} × ${plan.extraBranchPrice.toLocaleString('es-MX')}/mes)</span>
                    )}
                  </div>
                </Field>
              )}

              {/* Payment method toggle */}
              <div style={{ marginBottom: 20 }}>
                <div style={labelStyle}>Método de pago</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['card', 'spei'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 999,
                        border: `2px solid ${paymentMethod === method ? 'var(--purple)' : 'var(--border)'}`,
                        background: paymentMethod === method ? 'rgba(109,74,255,0.06)' : 'transparent',
                        color: paymentMethod === method ? 'var(--purple)' : 'var(--muted)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: '0.15s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {method === 'card' ? 'Tarjeta' : 'SPEI'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card brand badges */}
              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginRight: 4 }}>Aceptamos:</span>
                  <span style={{ background: '#1a1f71', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1 }}>VISA</span>
                  <span style={{ background: '#eb001b', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>MC</span>
                  <span style={{ background: '#2e77bc', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>AMEX</span>
                </div>
              )}

              {/* Card form */}
              {paymentMethod === 'card' && (
                <div>
                  <Field label="Nombre en tarjeta">
                    {/* NOTE: These fields will be tokenized via Openpay.js (OpenPay.token.create). Ankode never receives raw card data. */}
                    <input
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      value={cardData.name}
                      onChange={handleCardChange('name')}
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
                  {!hasOnlyAccessories && (
                    <Field label="Nombre de tu negocio">
                      <input
                        type="text"
                        placeholder="Ej. Veterinaria San Blas"
                        value={cardData.businessName}
                        onChange={handleCardChange('businessName')}
                        style={inputStyle}
                        autoComplete="organization"
                      />
                    </Field>
                  )}
                  {!hasOnlyAccessories && (
                    <Field label="Tipo de negocio">
                      <select
                        required
                        value={cardData.businessType}
                        onChange={handleCardChange('businessType')}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                      >
                        <option value="" disabled>Selecciona tu giro</option>
                        {[
                          'Tienda', 'Tlapalería', 'Papelería', 'Veterinaria',
                          'Dentista', 'Farmacia', 'Farmacia con consultorio',
                          'Clínica chica', 'Restaurante', 'Otro',
                        ].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                  {!hasOnlyAccessories && (
                    <Field label="Contraseña para tu cuenta (mínimo 8 caracteres)">
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={cardData.password}
                        onChange={handleCardChange('password')}
                        style={inputStyle}
                        autoComplete="new-password"
                      />
                    </Field>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <Field label="Mes venc.">
                      <input
                        type="text"
                        placeholder="MM"
                        value={cardData.expMonth}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                          if (val === '' || Number(val) <= 12) {
                            setCardData(prev => ({ ...prev, expMonth: val }));
                          }
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
                        onChange={handleNumericChange('expYear', 2)}
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
                        onChange={handleNumericChange('cvv', 4)}
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
                      onChange={handleCardChange('email')}
                      style={inputStyle}
                      autoComplete="email"
                    />
                  </Field>
                  {/* Openpay security notice with inline SVG logo */}
                  <div style={{ background: 'var(--bg-soft)', borderRadius: 12, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 28" height="20" aria-label="Openpay">
                      <circle cx="12" cy="14" r="10" fill="#00b3e6" />
                      <circle cx="12" cy="14" r="5" fill="white" />
                      <text x="26" y="19" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="15" fill="#00b3e6">openpay</text>
                    </svg>
                    <span>🔒 Tu tarjeta es tokenizada por Openpay. Ankode nunca almacena tus datos de pago.</span>
                  </div>
                </div>
              )}

              {/* SPEI */}
              {paymentMethod === 'spei' && (
                <div>
                  <Field label="Email (para recibir la CLABE)">
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={speiEmail}
                      onChange={(e) => setSpeiEmail(e.target.value)}
                      style={inputStyle}
                      autoComplete="email"
                    />
                  </Field>
                  <div
                    style={{
                      background: 'var(--bg-soft)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      fontSize: '0.88rem',
                      color: 'var(--muted)',
                      marginBottom: 16,
                    }}
                  >
                    Al confirmar recibirás una CLABE interbancaria en tu correo. Tu suscripción se activará al detectarse el pago.
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  className="pill"
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    borderRadius: 12,
                    height: 'auto',
                    padding: '10px 14px',
                    marginBottom: 12,
                    fontSize: '0.88rem',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Total visible + Submit */}
              <div style={{ background: 'var(--bg-soft)', borderRadius: 12, padding: '10px 16px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>Total a pagar</span>
                <span style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--purple)' }}>
                  ${total.toLocaleString('es-MX')} MXN
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Procesando...' : 'Confirmar y pagar'}
              </button>
            </form>

            {/* Legal links */}
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: 12, marginBottom: 4, lineHeight: 1.6 }}>
              Al continuar aceptas nuestros{' '}
              <a href="/legal?doc=terms" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                términos y condiciones
              </a>
              {', '}
              <a href="/legal?doc=privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                aviso de privacidad
              </a>
              {' y '}
              <a href="/legal?doc=refunds" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                política de cancelación
              </a>
              .
            </p>
            {/* Support info */}
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4, marginBottom: 0 }}>
              ¿Necesitas ayuda?{' '}
              <a href="mailto:ankodemx@gmail.com" style={{ color: 'var(--muted)' }}>
                ankodemx@gmail.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
