import React, { useEffect, useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ankode.cloud';

const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  green: '#10B981',
  purple: '#7C3AED',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#334155',
  error: '#EF4444',
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: COLORS.bg,
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '24px 16px',
  },
  card: {
    background: COLORS.card,
    borderRadius: 24,
    padding: '48px 40px',
    maxWidth: 460,
    width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
  },
  logo: {
    height: 32,
    marginBottom: 32,
    opacity: 0.9,
  },
  title: {
    margin: '0 0 12px',
    color: COLORS.text,
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  sub: {
    margin: '0 0 8px',
    color: COLORS.muted,
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  email: {
    display: 'inline-block',
    margin: '12px 0 4px',
    color: COLORS.green,
    fontWeight: 700,
    fontSize: '1rem',
    wordBreak: 'break-all',
  },
  btnGreen: {
    display: 'inline-block',
    marginTop: 28,
    padding: '13px 32px',
    background: COLORS.green,
    color: 'white',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '0.95rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  btnOutline: {
    display: 'inline-block',
    marginTop: 20,
    padding: '11px 28px',
    background: 'transparent',
    color: COLORS.muted,
    borderRadius: 999,
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
    border: `1.5px solid ${COLORS.border}`,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: 16,
    lineHeight: 1,
  },
  spinner: {
    width: 44,
    height: 44,
    border: `4px solid ${COLORS.border}`,
    borderTop: `4px solid ${COLORS.purple}`,
    borderRadius: '50%',
    margin: '0 auto 24px',
    animation: 'spin 0.9s linear infinite',
  },
  supportLink: {
    color: COLORS.purple,
    fontWeight: 700,
    textDecoration: 'none',
  },
};

function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.spinner} />
    </>
  );
}

function AnkodeLogo() {
  return (
    <div style={{ marginBottom: 28 }}>
      <svg height="28" viewBox="0 0 110 28" fill="none" aria-label="ankode">
        <rect width="28" height="28" rx="8" fill="#7C3AED" />
        <path d="M8 20L14 8L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 16H17.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <text x="36" y="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="15" fill="#F8FAFC">ankode</text>
      </svg>
    </div>
  );
}

export default function PagoResultado() {
  const [screen, setScreen] = useState('loading'); // 'loading' | 'success' | 'error' | 'timeout'
  const [provisionedEmail, setProvisionedEmail] = useState('');
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlStatus = params.get('status');
    const orderId = params.get('order_id');
    const chargeId = params.get('id');

    if (urlStatus === 'failed' || urlStatus === 'cancelled') {
      setScreen('error');
      return;
    }

    if (orderId || chargeId) {
      startPolling(orderId, chargeId);
    } else {
      setScreen('error');
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function startPolling(orderId, chargeId) {
    const qs = orderId
      ? `order_id=${encodeURIComponent(orderId)}`
      : `charge_id=${encodeURIComponent(chargeId)}`;

    const poll = () => {
      fetch(`${API_BASE}/api/onboarding/status?${qs}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status === 'provisioned') {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
            setProvisionedEmail(data.email || '');
            setScreen('success');
          } else if (data.status === 'failed') {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
            setScreen('error');
          }
        })
        .catch(() => {});
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setScreen('timeout');
    }, 60000);
  }

  if (screen === 'loading') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <AnkodeLogo />
          <Spinner />
          <h2 style={styles.title}>Activando tu cuenta...</h2>
          <p style={styles.sub}>Esto tarda unos segundos, no cierres esta página.</p>
        </div>
      </div>
    );
  }

  if (screen === 'success') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <AnkodeLogo />
          <div style={styles.icon}>✅</div>
          <h2 style={{ ...styles.title, color: COLORS.green }}>¡Tu cuenta está lista!</h2>
          <p style={styles.sub}>Hemos enviado tus credenciales de acceso a:</p>
          <span style={styles.email}>{provisionedEmail}</span>
          <p style={{ ...styles.sub, marginTop: 12 }}>Revisa tu bandeja de entrada y carpeta de spam.</p>
          <a href="https://pos.ankode.cloud/login" style={styles.btnGreen}>
            Ir al POS
          </a>
        </div>
      </div>
    );
  }

  if (screen === 'timeout') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <AnkodeLogo />
          <div style={styles.icon}>⏳</div>
          <h2 style={styles.title}>Aún estamos procesando tu cuenta</h2>
          <p style={styles.sub}>
            Tu pago fue recibido. La activación puede tardar unos minutos más.
            Recibirás un correo con tus credenciales en breve.
          </p>
          <p style={{ ...styles.sub, marginTop: 16 }}>
            Si no recibes nada en 10 minutos, escríbenos a{' '}
            <a href="mailto:ankodemx@gmail.com" style={styles.supportLink}>
              ankodemx@gmail.com
            </a>
          </p>
          <a href="https://ankode.cloud" style={styles.btnOutline}>
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <AnkodeLogo />
        <div style={styles.icon}>❌</div>
        <h2 style={{ ...styles.title, color: COLORS.error }}>Hubo un problema con tu pago</h2>
        <p style={styles.sub}>
          Si el cargo fue aplicado contacta a{' '}
          <a href="mailto:ankodemx@gmail.com" style={styles.supportLink}>
            ankodemx@gmail.com
          </a>
        </p>
        <a href="https://ankode.cloud" style={styles.btnGreen}>
          Intentar de nuevo
        </a>
      </div>
    </div>
  );
}
