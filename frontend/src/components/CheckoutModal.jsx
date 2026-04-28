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

  useEffect(() => {
    if (isOpen) {
      loadOpenpayScripts().catch(err => console.error('Openpay scripts failed to load:', err));
    }
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

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const planType = isAnnual ? 'yearly' : 'monthly';
      const amount = isCartMode ? cartTotal : (isAnnual ? plan.annualPrice : plan.monthlyPrice);

      let cardToken = null;
      if (paymentMethod === 'card') {
        const tokenResponse = await tokenizeCard({
          card_number: cardData.number.replace(/\s/g, ''),
          expiration_month: cardData.expMonth,
          expiration_year: cardData.expYear.length === 4 ? cardData.expYear.slice(2) : cardData.expYear,
          cvv2: cardData.cvv,
          holder_name: cardData.name,
        });
        cardToken = tokenResponse.data.id;
      }

      await submitCheckout({
        planType,
        amount,
        cardToken,
        email: paymentMethod === 'card' ? cardData.email : speiEmail,
        name: cardData.name || '',
        businessName: cardData.businessName || '',
        ownerName: cardData.name || '',
        password: cardData.password || '',
        posType: isCartMode ? 'cart' : plan.id,
        planName: isCartMode ? 'Carrito' : plan.name,
        paymentMethod,
      });

      setIsLoading(false);
      onSubmitPayment({ success: true });
      setError(null);
      alert('✅ ¡Suscripción activada! Revisa tu correo para recibir tus credenciales de acceso. Tu pago fue procesado correctamente.');
      onClose();
    } catch (err) {
      setIsLoading(false);
      const rawMsg = err.message || '';
      const declinedPhrases = ['fondos insuficientes', 'insufficient funds', 'tarjeta reportada', 'lost card', 'stolen', 'robada', 'perdida'];
      const isDeclined = declinedPhrases.some(p => rawMsg.toLowerCase().includes(p));
      setError(isDeclined ? 'Tarjeta declinada. Intenta con otra tarjeta.' : (rawMsg || 'Ocurrió un error. Intenta de nuevo.'));
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

          {paymentMethod === 'card' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginRight: 4 }}>Aceptamos:</span>
              <img src="https://js.openpay.mx/images/visa.png" alt="Visa" style={{ height: 24, objectFit: 'contain' }} />
              <img src="https://js.openpay.mx/images/mastercard.png" alt="Mastercard" style={{ height: 24, objectFit: 'contain' }} />
              <img src="https://js.openpay.mx/images/american_express.png" alt="AMEX" style={{ height: 24, objectFit: 'contain' }} />
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
                    onChange={handleCardChange('expMonth')}
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
                    onChange={handleCardChange('expYear')}
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
                    onChange={handleCardChange('cvv')}
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
              <div style={{ background: 'var(--bg-soft)', borderRadius: 12, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="https://js.openpay.mx/images/openpay.png" alt="Openpay" style={{ height: 24, objectFit: 'contain' }} />
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

          {/* Submit */}
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Procesando...' : `Confirmar y pagar — $${total.toLocaleString('es-MX')} MXN`}
          </button>
        </form>

        {/* Terms link */}
        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--muted)', marginTop: 14, marginBottom: 0 }}>
          Al continuar aceptas nuestros{' '}
          <a
            href="/legal?doc=terms"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--purple)', fontWeight: 700 }}
          >
            términos y condiciones
          </a>
        </p>
      </div>
    </div>
  );
}
