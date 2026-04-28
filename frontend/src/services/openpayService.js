const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ankode.cloud';
const OPENPAY_MERCHANT_ID = import.meta.env.VITE_OPENPAY_MERCHANT_ID || '';
const OPENPAY_PUBLIC_KEY = import.meta.env.VITE_OPENPAY_PUBLIC_KEY || '';
const IS_SANDBOX = import.meta.env.VITE_OPENPAY_SANDBOX === 'true';

export async function loadOpenpayScripts() {
  // Sandbox: https://js.openpay.mx/openpay.v1.min.js
  // Production: same URL — sandbox mode is set via OpenPay.setSandboxMode()
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  await loadScript('https://js.openpay.mx/openpay.v1.min.js');
  await loadScript('https://js.openpay.mx/openpay-data.v1.min.js');

  window.OpenPay.setId(OPENPAY_MERCHANT_ID);
  window.OpenPay.setApiKey(OPENPAY_PUBLIC_KEY);
  // Switch setSandboxMode to false when moving to production
  window.OpenPay.setSandboxMode(IS_SANDBOX);
}

export function tokenizeCard(cardData) {
  // cardData: { card_number, expiration_month, expiration_year, cvv2, holder_name }
  return new Promise((resolve, reject) => {
    window.OpenPay.token.create(cardData, resolve, reject);
  });
}

export async function submitCheckout(payload) {
  // payload for new signup: { planType, amount, cardToken, email, name, businessName, ownerName, password, posType, planName }
  // planType must be "monthly" or "yearly"
  const token = localStorage.getItem('ankode_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/api/openpay/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Error al procesar el pago');
  }
  return data;
}

