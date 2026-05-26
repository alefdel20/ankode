import { LEGAL, WEB_TERMS } from '../constants/legal';

const DOCS = {
  terms: { title: '📋 Términos y Condiciones de Uso', content: LEGAL.terms },
  privacy: { title: '🔒 Aviso de Privacidad', content: LEGAL.privacy },
  cancellation: { title: '❌ Política de Cancelación', content: LEGAL.cancellation },
  webTerms: { title: '🌐 Términos del Servicio — Páginas Web', clauses: WEB_TERMS },
};

export default function Legal() {
  const params = new URLSearchParams(window.location.search);
  const doc = DOCS[params.get('doc')] || DOCS.terms;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1d2433', lineHeight: 1.7 }}>
      <a href="/" style={{ display: 'inline-block', marginBottom: 32, color: '#6d4aff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
        ← Volver a Ankode
      </a>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 32, borderBottom: '2px solid #e5eaf5', paddingBottom: 16 }}>
        {doc.title}
      </h1>
      {doc.clauses ? (
        <div style={{ display: 'grid', gap: 32 }}>
          {doc.clauses.map((clause) => (
            <div key={clause.number}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: '#1d2433', fontSize: '1rem' }}>
                Cláusula {clause.number}. {clause.title}
              </div>
              <div style={{
                background: '#dbf7ea', color: '#0d8f59',
                borderRadius: 8, padding: '10px 14px',
                fontSize: '0.88rem', marginBottom: 8, lineHeight: 1.6,
              }}>
                {clause.summary}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#667085', lineHeight: 1.7 }}>
                {clause.legal}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ whiteSpace: 'pre-line', fontSize: '0.97rem', color: '#667085', lineHeight: 1.8 }}>
          {doc.content}
        </div>
      )}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #e5eaf5', fontSize: '0.85rem', color: '#667085' }}>
        <p>¿Tienes dudas? Escríbenos a <a href="mailto:ankodemx@gmail.com" style={{ color: '#6d4aff', fontWeight: 700 }}>ankodemx@gmail.com</a></p>
        <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
          <a href="/legal?doc=terms" target="_blank" style={{ color: '#667085' }}>Términos y Condiciones</a>
          <a href="/legal?doc=privacy" target="_blank" style={{ color: '#667085' }}>Aviso de Privacidad</a>
          <a href="/legal?doc=cancellation" target="_blank" style={{ color: '#667085' }}>Política de Cancelación</a>
        </div>
      </div>
    </div>
  );
}
