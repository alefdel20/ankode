import { useState } from 'react';
import ankodeLogo from '../assets/ankode-logo.png';
import TermsModal from '../components/web-order/TermsModal';
import BasicForm from '../components/web-order/BasicForm';
import AdvancedForm from '../components/web-order/AdvancedForm';
import WebPaymentStep from '../components/web-order/WebPaymentStep';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ankode.cloud';

const PLAN_CONFIG = {
  basico:   { name: 'Presencia básica', totalWithIva: 2655.24 },
  avanzado: { name: 'Página avanzada',  totalWithIva: 8668.84 },
};

const STEP_LABELS = ['Términos', 'Tu negocio', 'Pago'];

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.9rem',
                background: done ? 'var(--green)' : active ? 'var(--purple)' : 'var(--border)',
                color: done || active ? 'white' : 'var(--muted)',
                transition: '0.2s ease',
              }}>
                {done ? '✓' : num}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: active ? 800 : 500,
                color: active ? 'var(--text-strong)' : 'var(--muted)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                width: 60, height: 2, margin: '0 8px',
                background: done ? 'var(--green)' : 'var(--border)',
                marginBottom: 22,
                transition: '0.2s ease',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WebContratar() {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan') || 'basico';
  const planConfig = PLAN_CONFIG[plan] || PLAN_CONFIG.basico;

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paso 1: avanza localmente, sin llamada al backend todavía
  const handleAcceptTerms = () => {
    setStep(2);
  };

  // Paso 2: POST con todos los datos juntos (TC + cuestionario)
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const body = { plan, tc_accepted: true, tc_ip: '', ...formData };
      console.log('[WebContratar] POST /api/web-services/orders body:', body);

      const response = await fetch(`${API_BASE}/api/web-services/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error('[WebContratar] 400 response:', data);
        throw new Error(data.message || data.error || 'Error al guardar tu información');
      }

      setOrderId(data.order_id || data.id);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'inherit' }}>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
        background: 'white',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <a href="/paginas-web" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={ankodeLogo} alt="ankode" style={{ height: 30, width: 'auto' }} />
        </a>
        <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
          Página web · Plan <strong style={{ color: 'var(--text-strong)' }}>{planConfig.name}</strong>
        </span>
      </header>

      {/* Contenido del flujo */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 16px 80px' }}>
        <StepIndicator current={step} />

        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626',
            borderRadius: 12, padding: '12px 16px',
            marginBottom: 24, fontSize: '0.9rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <TermsModal plan={plan} onAccept={handleAcceptTerms} loading={false} />
        )}

        {step === 2 && plan === 'avanzado' && (
          <AdvancedForm onSubmit={handleFormSubmit} loading={loading} />
        )}

        {step === 2 && plan !== 'avanzado' && (
          <BasicForm onSubmit={handleFormSubmit} loading={loading} />
        )}

        {step === 3 && (
          <WebPaymentStep
            orderId={orderId}
            plan={plan}
            amount={planConfig.totalWithIva}
          />
        )}
      </div>
    </div>
  );
}
