const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ankode.cloud';

export default function PagoResultado() {
  const [status, setStatus] = React.useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chargeId = params.get('id');

    if (!chargeId) {
      setStatus('error');
      setErrorMsg('No se recibió un ID de transacción.');
      return;
    }

    fetch(`${API_BASE}/api/openpay/verify-3ds?id=${encodeURIComponent(chargeId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.status === 'completed') {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(data.status === 'failed'
            ? 'El pago fue declinado. Por favor intenta con otra tarjeta.'
            : `Estado del pago: ${data.status || 'desconocido'}.`);
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('No se pudo verificar el estado del pago. Contacta a soporte.');
      });
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, system-ui, sans-serif',
    background: '#f8f9fb',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: 24,
    padding: '48px 40px',
    maxWidth: 440,
    width: 'calc(100% - 32px)',
    boxShadow: '0 16px 48px rgba(55,72,112,0.12)',
    textAlign: 'center',
  };

  const btnStyle = {
    display: 'inline-block',
    marginTop: 28,
    padding: '12px 28px',
    background: '#6d4aff',
    color: 'white',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '0.95rem',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
  };

  if (status === 'loading') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⏳</div>
          <h2 style={{ margin: '0 0 8px', color: '#1d2433', fontSize: '1.3rem' }}>Verificando tu pago…</h2>
          <p style={{ color: '#667085', margin: 0, fontSize: '0.95rem' }}>Espera un momento, estamos confirmando la transacción.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ margin: '0 0 8px', color: '#6d4aff', fontSize: '1.4rem' }}>¡Pago completado!</h2>
          <p style={{ color: '#667085', margin: '0 0 4px', fontSize: '0.95rem' }}>
            Tu transacción fue autenticada y procesada correctamente.
          </p>
          <p style={{ color: '#667085', margin: 0, fontSize: '0.9rem' }}>
            Revisa tu correo para recibir tus credenciales de acceso.
          </p>
          <a href="https://ankode.cloud" style={btnStyle}>Volver a Ankode</a>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
        <h2 style={{ margin: '0 0 8px', color: '#dc2626', fontSize: '1.4rem' }}>Pago no completado</h2>
        <p style={{ color: '#667085', margin: '0 0 4px', fontSize: '0.95rem' }}>{errorMsg}</p>
        <p style={{ color: '#667085', margin: 0, fontSize: '0.88rem' }}>
          ¿Necesitas ayuda?{' '}
          <a href="mailto:ankodemx@gmail.com" style={{ color: '#6d4aff', fontWeight: 700 }}>
            ankodemx@gmail.com
          </a>
        </p>
        <a href="https://ankode.cloud" style={btnStyle}>Volver a Ankode</a>
      </div>
    </div>
  );
}

// React must be in scope for JSX in this file (no automatic runtime assumed)
import React from 'react';
