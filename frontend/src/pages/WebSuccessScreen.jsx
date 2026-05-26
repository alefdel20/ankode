import { useEffect, useRef, useState } from 'react';
import ankodeLogo from '../assets/ankode-logo.png';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ankode.cloud';
const WA_LINK = 'https://wa.me/525515133527?text=Hola%2C%20acabo%20de%20pagar%20mi%20p%C3%A1gina%20web%20en%20ankode%20y%20quiero%20mandar%20mi%20logo%20y%20fotos.';

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
    maxWidth: 480,
    width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
  },
  title: { margin: '0 0 12px', color: COLORS.text, fontSize: '1.5rem', fontWeight: 800 },
  sub: { margin: '0 0 8px', color: COLORS.muted, fontSize: '0.95rem', lineHeight: 1.6 },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 },
  icon: { fontSize: '3rem', marginBottom: 16, lineHeight: 1 },
  spinner: {
    width: 44, height: 44,
    border: `4px solid ${COLORS.border}`,
    borderTop: `4px solid ${COLORS.purple}`,
    borderRadius: '50%',
    margin: '0 auto 24px',
    animation: 'spin 0.9s linear infinite',
  },
  btnGreen: {
    display: 'inline-block', marginTop: 24, padding: '13px 28px',
    background: COLORS.green, color: 'white', borderRadius: 999,
    fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  },
  btnOutline: {
    display: 'inline-block', marginTop: 16, padding: '11px 24px',
    background: 'transparent', color: COLORS.muted, borderRadius: 999,
    fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
    border: `1.5px solid ${COLORS.border}`, cursor: 'pointer', fontFamily: 'inherit',
  },
  supportLink: { color: COLORS.purple, fontWeight: 700, textDecoration: 'none' },
};

function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.spinner} />
    </>
  );
}

function Logo() {
  return (
    <div style={{ marginBottom: 28 }}>
      <img src={ankodeLogo} alt="ankode" style={{ height: 28, opacity: 0.9 }} />
    </div>
  );
}

export default function WebSuccessScreen() {
  const [screen, setScreen] = useState('loading');
  const [orderData, setOrderData] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlStatus = params.get('status');
    const orderId = params.get('order_id');

    if (urlStatus === 'failed' || urlStatus === 'cancelled') {
      setScreen('error');
      return;
    }

    if (!orderId) {
      setScreen('error');
      return;
    }

    startPolling(orderId);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function startPolling(orderId) {
    const poll = () => {
      fetch(`${API_BASE}/api/web-services/orders/${orderId}`)
        .then(r => r.json())
        .then(data => {
          if (data.status === 'completed' || data.status === 'provisioned') {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
            setOrderData(data);
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
          <Logo />
          <Spinner />
          <h2 style={styles.title}>Confirmando tu pago...</h2>
          <p style={styles.sub}>Esto tarda unos segundos, no cierres esta página.</p>
        </div>
      </div>
    );
  }

  if (screen === 'success') {
    const planName  = orderData?.plan_name  || orderData?.plan || 'Web';
    const amount    = orderData?.amount     ? `$${Number(orderData.amount).toLocaleString('es-MX')} MXN` : null;
    const days      = orderData?.delivery_days;

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <Logo />
          <div style={styles.icon}>✅</div>
          <h2 style={{ ...styles.title, color: COLORS.green }}>¡Tu página está en camino!</h2>
          <p style={styles.sub}>Tu pago fue recibido. Ahora el equipo de ankode empieza a trabajar en tu página.</p>

          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '16px 20px', margin: '20px 0', textAlign: 'left', border: `1px solid ${COLORS.border}` }}>
            {planName && (
              <div style={styles.row}>
                <span style={{ color: COLORS.muted }}>Plan</span>
                <strong style={{ color: COLORS.text }}>Página Web {planName}</strong>
              </div>
            )}
            {amount && (
              <div style={styles.row}>
                <span style={{ color: COLORS.muted }}>Pagado</span>
                <strong style={{ color: COLORS.green }}>{amount}</strong>
              </div>
            )}
            {days && (
              <div style={{ ...styles.row, marginBottom: 0 }}>
                <span style={{ color: COLORS.muted }}>Entrega estimada</span>
                <strong style={{ color: COLORS.text }}>{days} días hábiles</strong>
              </div>
            )}
          </div>

          <p style={{ ...styles.sub, marginTop: 16 }}>
            El siguiente paso es mandarnos tu <strong style={{ color: COLORS.text }}>logo, fotos de tu negocio</strong> y cualquier referencia de estilo por WhatsApp. Así empezamos.
          </p>

          <a href={WA_LINK} target="_blank" rel="noreferrer" style={styles.btnGreen}>
            Mandar logo y fotos por WhatsApp
          </a>
          <br />
          <a href="/" style={styles.btnOutline}>Volver al inicio</a>
        </div>
      </div>
    );
  }

  if (screen === 'timeout') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <Logo />
          <div style={styles.icon}>⏳</div>
          <h2 style={styles.title}>Aún estamos confirmando tu pago</h2>
          <p style={styles.sub}>
            Tu pago fue recibido. La confirmación puede tardar unos minutos más.
            Te avisamos por correo cuando todo esté listo.
          </p>
          <p style={{ ...styles.sub, marginTop: 16 }}>
            Si no recibes nada en 10 minutos, escríbenos a{' '}
            <a href="mailto:ankodemx@gmail.com" style={styles.supportLink}>ankodemx@gmail.com</a>
          </p>
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={styles.btnGreen}>
            Contactar por WhatsApp
          </a>
          <br />
          <a href="/" style={styles.btnOutline}>Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Logo />
        <div style={styles.icon}>❌</div>
        <h2 style={{ ...styles.title, color: COLORS.error }}>Hubo un problema con tu pago</h2>
        <p style={styles.sub}>
          Si el cargo fue aplicado contáctanos a{' '}
          <a href="mailto:ankodemx@gmail.com" style={styles.supportLink}>ankodemx@gmail.com</a>
        </p>
        <a href="/paginas-web" style={styles.btnGreen}>Intentar de nuevo</a>
      </div>
    </div>
  );
}
