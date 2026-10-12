# Reporte de investigación — Landing Ankode (FASE 1, solo lectura)

Alcance: `C:\Users\tatue\Documents\ankode 2\frontend`. No se modificó ningún archivo.

---

## 1. Estructura del proyecto

Es un **monorepo de un solo frontend** (no hay carpeta separada de backend en este repo). Vite + React puro, sin librería de routing.

```
frontend/
├── index.html                          # entry HTML — carga Google Fonts DM Serif Display + DM Sans
├── vite.config.js                      # config mínima: solo @vitejs/plugin-react
├── package.json                        # react 18.3.1, react-dom 18.3.1, vite 5.4.11 — SIN react-router
├── .env.example / .env.local           # VITE_API_URL, VITE_OPENPAY_MERCHANT_ID, VITE_OPENPAY_PUBLIC_KEY, VITE_OPENPAY_SANDBOX
├── src/
│   ├── main.jsx                        # enrutador manual por window.location.pathname
│   ├── App.jsx                         # página Home (976 líneas) — todo el home vive aquí
│   ├── App.css                         # 1040 líneas
│   ├── index.css                       # 974 líneas
│   ├── assets/
│   │   ├── ankode-logo.png
│   │   └── screenshots/ (6 PNG: ventas-retail, cocina-kds, comanda-mesa, dashboard, kits, veterinaria-menu)
│   ├── constants/
│   │   ├── plans.js                    # PLANS (planes POS) + TERMS
│   │   └── legal.js                    # LEGAL (terms/privacy/cancellation) + WEB_TERMS (cláusulas páginas web)
│   ├── components/
│   │   ├── PricingSection.jsx          # sección "Planes y precios" (POS) — usada en Home
│   │   ├── CheckoutModal.jsx           # modal de checkout/Openpay — usado en Home
│   │   ├── landing/
│   │   │   ├── WebPlansSection.jsx     # sección "Páginas web" — usada en Home
│   │   │   └── HowItWorks.jsx          # ⚠️ NO IMPORTADO EN NINGÚN LADO (código muerto)
│   │   └── web-order/
│   │       ├── BasicForm.jsx           # formulario paso 2, plan básico — usado en WebContratar
│   │       ├── AdvancedForm.jsx        # formulario paso 2, plan avanzado — usado en WebContratar
│   │       ├── TermsModal.jsx          # paso 1 del flujo /paginas-web/contratar
│   │       └── WebPaymentStep.jsx      # paso 3, cobro Openpay — usado en WebContratar
│   ├── pages/
│   │   ├── Legal.jsx                   # /legal
│   │   ├── PagoResultado.jsx           # /pago-resultado
│   │   ├── WebServiceOrder.jsx         # /paginas-web
│   │   ├── WebContratar.jsx            # /paginas-web/contratar
│   │   └── WebSuccessScreen.jsx        # /paginas-web/gracias
│   └── services/
│       └── openpayService.js           # loadOpenpayScripts, tokenizeCard, submitCheckout
```

### Framework y routing

- **No hay React Router ni ninguna librería de routing.** `package.json` solo declara `react` y `react-dom` como dependencias.
- El "routing" se hace a mano en `src/main.jsx:11-50` leyendo `window.location.pathname` y montando un componente distinto por cada ruta reconocida. Es un switch/if plano, no hay rutas anidadas, params dinámicos vía router, ni lazy loading.
- Rutas existentes (todas hardcodeadas en `main.jsx`):

| Path | Componente | Archivo |
|---|---|---|
| `/` (default/else) | `App` | `src/App.jsx` |
| `/legal` | `Legal` | `src/pages/Legal.jsx` |
| `/pago-resultado` | `PagoResultado` | `src/pages/PagoResultado.jsx` |
| `/paginas-web` | `WebServiceOrder` | `src/pages/WebServiceOrder.jsx` |
| `/paginas-web/contratar` | `WebContratar` | `src/pages/WebContratar.jsx` |
| `/paginas-web/gracias` | `WebSuccessScreen` | `src/pages/WebSuccessScreen.jsx` |

Query params se leen manualmente con `new URLSearchParams(window.location.search)` en cada página que los necesita (`Legal.jsx:11`, `WebContratar.jsx:63`, `PagoResultado.jsx:139-141`, `WebSuccessScreen.jsx:89-91`).

---

## 2. Secciones actuales de la landing (Home, `App.jsx`)

Orden real tal como se renderizan dentro de `<main>` en `App.jsx`:

| # | Sección | Componente / bloque | Archivo:línea |
|---|---|---|---|
| 1 | Header/Topbar (fijo, fuera de `<main>`) | inline en `App` | `App.jsx:451-486` |
| 2 | Menú móvil (condicional) | inline en `App` | `App.jsx:488-502` |
| 3 | Hero | `<section className="hero">` | `App.jsx:505-585` |
| 4 | Módulos principales | `<section id="modulos">` | `App.jsx:587-621` |
| 5 | Problema (split-section) | `<section className="section split-section">` | `App.jsx:623-647` |
| 6 | Por giro (acordeón de verticales) | `<section id="giros">` | `App.jsx:649-710` |
| 7 | Personalización | `<section id="personalizacion">` | `App.jsx:712-738` |
| 8 | Beneficios | `<section className="section benefits-layout">` | `App.jsx:740-771` |
| 9 | Cómo funciona (pasos genéricos) | `<section className="section section-soft">` | `App.jsx:773-790` |
| 10 | Planes y precios (POS) | `<PricingSection />` | `App.jsx:792-797` → componente en `src/components/PricingSection.jsx` |
| 11 | Facturación CFDI (add-on) | `<section className="section">` | `App.jsx:799-836` |
| 12 | Screenshots del producto | `<section className="section section-soft">` | `App.jsx:838-854` |
| 13 | Páginas web (planes web) | `<WebPlansSection />` | `App.jsx:856` → componente en `src/components/landing/WebPlansSection.jsx` |
| 14 | FAQ | `<section id="faq">` | `App.jsx:858-873` |
| 15 | CTA final | `<section id="cta">` | `App.jsx:875-894` |
| 16 | Footer | `<footer className="footer">` | `App.jsx:897-933` |

Modales/overlays fuera del flujo de `<main>`: `CheckoutModal` (`App.jsx:935-945`, componente en `src/components/CheckoutModal.jsx`) y `CartDrawer` (`App.jsx:947-971`, definido inline en `App.jsx:316-396`).

**Nota:** `HowItWorks.jsx` (`src/components/landing/HowItWorks.jsx`) define una sección "¿Cómo funciona?" con pasos específicos de páginas web (elegir plan, contar tu negocio, pagar setup, mandar logo, publicación), pero **no está importado en `App.jsx` ni en ningún otro archivo** — es código muerto. El bloque #9 de la tabla de arriba ("Cómo funciona") es un componente distinto e inline, con pasos genéricos del POS, no de páginas web.

---

## 3. Copy actual (texto verbatim)

### Header / Topbar (`App.jsx:456-463`)
Nav: `Módulos` · `Por giro` · `Personalización` · `Preguntas frecuentes` · `Páginas web` · `Planes`
Botones: `Ver carrito` (icono) · `Solicitar demo`

### Hero (`App.jsx:507-530`)
- Eyebrow: `POS adaptable para negocios reales`
- H1: `Controla tu negocio desde ` + `un solo sistema` (span highlight)
- Texto: `Ventas, inventario, proveedores y operación diaria en una solución pensada para la realidad de tu negocio.`
- CTAs: `Solicitar demo` · `Ver cómo funciona` · `Ver planes y precios`
- Microcopy: `Multiempresa` · `Roles y accesos` · `Soporte remoto`
- Dashboard mock: `Ventas del día` `$12,480` / `Inventario` `128 productos` / `Crédito activo` `18 clientes`
- Tabla mock: `Alimento premium` 24 OK · `Antiparasitario` 8 Bajo · `Collar clínico` 15 OK
- Floating notes: `Operación más clara` · `Control en un solo lugar`

### Módulos principales (`App.jsx:34-43`, `587-621`)
- Eyebrow: `Módulos principales`
- H2: `Todo lo importante para operar mejor.`
- Texto: `ankode reúne funciones clave para ayudarte a trabajar con más orden, más control y menos fricción.`
- 8 módulos (título — descripción):
  1. **Ventas** — "Registra cada venta, aplica descuentos, gestiona métodos de pago y genera tu corte de caja diario."
  2. **Inventario** — "Controla tu stock en tiempo real, recibe alertas de productos bajos y lleva el historial de movimientos."
  3. **Proveedores** — "Administra tus proveedores, registra órdenes de compra y da seguimiento a reabastecimientos."
  4. **Crédito y cobranza** — "Vende a crédito, lleva el saldo de cada cliente y envía recordatorios de pago automáticos."
  5. **Finanzas básicas** — "Visualiza ingresos, egresos y utilidad de tu negocio en reportes claros por período."
  6. **Recordatorios** — "Programa y automatiza recordatorios para clientes con pagos pendientes o citas próximas."
  7. **Soporte remoto** — "Accede a soporte técnico sin necesidad de visitas presenciales — resolvemos desde donde estás."
  8. **Roles y accesos** — "Asigna permisos específicos a cada usuario: Admin, Cajero, Almacén, Vendedor y Gerente."

### Problema (`App.jsx:625-646`)
- Eyebrow: `Problema`
- H2: `No todos los negocios pueden trabajar con un sistema genérico.`
- Texto: `Muchos terminan adaptándose al software, usando procesos incómodos o herramientas separadas para poder operar.`
- 3 tarjetas:
  - **Procesos dispersos** — "Ventas, inventario y control interno repartidos entre varias herramientas."
  - **Sistemas rígidos** — "No se ajustan a la forma real en que trabaja tu negocio."
  - **Tiempo perdido** — "Seguimientos manuales, menos claridad y más margen de error."

### Por giro (`App.jsx:649-656`)
- Eyebrow: `Por giro`
- H2: `Una solución para tu tipo de negocio.`
- Texto: `ankode se adapta a la operación de distintos comercios. Encuentra el tuyo.`
(contenido completo de cada giro en sección 4 de este reporte)

### Personalización (`App.jsx:712-736`)
- Eyebrow: `Personalización`
- H2: `Ankode se adapta a tu negocio, no al revés.`
- Texto: `Una de las principales ventajas de ankode es que puede ajustarse a la forma en que realmente trabajas.`
- 3 puntos:
  - **Configuración** — "Según tu operación real."
  - **Roles y accesos** — "De acuerdo con tu equipo."
  - **Evolución** — "Conforme crece tu negocio."

### Beneficios (`App.jsx:45-58`, `740-771`)
- Eyebrow: `Beneficios`
- H2: `Más control para tomar mejores decisiones.`
- Texto: `Tener información más clara te ayuda a operar mejor y crecer con más orden.`
- 3 tarjetas:
  - **Más control** — "Ten una visión más clara de ventas, inventario y operación sin depender de procesos manuales."
  - **Más orden** — "Centraliza tareas clave en un solo sistema y reduce la dispersión entre herramientas."
  - **Más adaptación** — "Si tu negocio necesita algo distinto, ankode puede ajustarse a tu operación real."
- Tarjeta grande: **"Un sistema que se adapta a tu operación."** — "ankode está pensado para ayudarte a tener más control sin complicar el trabajo diario." + lista: "Centraliza la operación en un solo lugar" / "Facilita el control de inventario, ventas y seguimiento" / "Permite organizar accesos y funciones por usuario"

### Cómo funciona — genérico (`App.jsx:60-65`, `773-790`)
- Eyebrow: `Cómo funciona`
- H2: `Un proceso simple para comenzar.`
- Texto: `Empezamos entendiendo tu negocio para mostrarte cómo ankode puede ayudarte.`
- 4 pasos: "Conocemos tu operación" · "Revisamos lo que necesitas controlar" · "Configuramos una propuesta acorde a tu negocio" · "Te acompañamos en la implementación"

### Planes y precios — POS (`PricingSection.jsx:114-140`)
- Eyebrow: `Planes y precios`
- H2: `El plan correcto para tu negocio.`
- Texto: `Todos los planes incluyen acceso completo a la plataforma web y soporte técnico. Cancela cuando quieras.`
- Toggle: `Mensual` / `Anual · 2 meses gratis (1er año)`
(precios en sección 5)

### Facturación CFDI (`App.jsx:799-836`)
- Eyebrow: `Facturación`
- H2: `Factura sin salir del ticket de venta`
- Texto: `Agrega facturación electrónica CFDI 4.0 a cualquier plan. Timbrado automático vía PAC certificado — sin manejar tú el proceso ante el SAT.`
- Bullets: "Timbrado automático vía PAC certificado" / "Factura generada desde la venta, sin recapturar datos" / "Compatible con personas físicas y morales"
- Precio: `+$149 MXN/mes · disponible en todos los planes`
- CTAs: `Agregar al carrito` · `Contratar ahora`

### Producto / Screenshots (`App.jsx:838-854`)
- Eyebrow: `Producto`
- H2: `Así se ve por dentro`
- Texto: `Capturas reales del sistema, no mockups.`
- Captions: `Ventas · Retail` · `Cocina · Pantalla en vivo (KDS)` · `Comanda digital` · `Reportes y resumen operativo` · `Combos y kits`

### Páginas web (`WebPlansSection.jsx:53-59`, `147-158`)
- Eyebrow: `Páginas web`
- H2: `Tu página lista antes de que te des cuenta.`
- Texto: `Sin rollos técnicos, sin esperar semanas, sin pagar de más.`
- Nota al pie: `¿Tienes dudas? Escríbenos al WhatsApp y con gusto te orientamos.`
(planes/precios en sección 5)

### FAQ (`App.jsx:67-84`, `858-873`)
- Eyebrow: `Preguntas frecuentes`
- H2: `Lo que más nos preguntan`
- Texto: `Resolvemos las dudas más comunes antes de empezar.`
- Preguntas:
  1. **¿Sirve para cualquier negocio?** — "Está pensado para adaptarse a distintos giros, especialmente veterinaria y retail."
  2. **¿Es difícil de usar?** — "No. La idea es que sea práctico y claro para la operación diaria."
  3. **¿Ya está listo para restaurantes?** — "Sí, puede configurarse para la operación de este giro."
  4. **¿Se puede ajustar a mi proceso?** — "Sí. Esa es una de las ideas principales detrás de ankode."

### CTA final (`App.jsx:875-894`)
- H2: `Deja de adaptar tu negocio al sistema.`
- Texto: `Mejor usa un sistema que pueda adaptarse a tu forma de trabajar.`
- CTAs: `Solicitar demo` · `Contactar por email`
- Links: `WhatsApp: 525515133527` · `Email: ankodemx@gmail.com`

### Footer (`App.jsx:897-933`)
- Texto: `Sistema POS adaptable para negocios que necesitan más control, más orden y una solución pensada para su operación real.`
- Columnas: **Producto** (Módulos, Por giro, Personalización) · **Empresa** (Solicitar demo, Preguntas frecuentes, Términos y condiciones, Cancelación, Privacidad de pago) · **Contacto** (WhatsApp, Email)
- Línea legal: `© 2025 Ankode · Todos los derechos reservados` + links legales + `Pagos procesados por Openpay`

---

## 4. Cómo se muestran hoy los verticales (retail/restaurante/veterinaria)

**No existen como secciones separadas del home.** Están **mezclados dentro de una sola sección de acordeón** llamada "Por giro" (`App.jsx:649-710`, datos en `App.jsx:86-180`, array `giros`). No hay landing pages ni rutas dedicadas por vertical — todo vive en el mismo componente `App.jsx`.

El array `giros` tiene **5 entradas** (no 3): `tienda`, `papeleria`, `tlapaleria`, `restaurante`, `veterinaria`. Cada una es una tarjeta acordeón (clic para expandir) con emoji, título, descripción, lista de features y un CTA a WhatsApp (excepto veterinaria).

| Giro | id | Emoji | CTA | Estado |
|---|---|---|---|---|
| Tienda | `tienda` | 🏪 | "Solicitar información" → WhatsApp | Activo |
| Papelería | `papeleria` | 📋 | "Solicitar información" → WhatsApp | Activo |
| Tlapalería | `tlapaleria` | 🔧 | "Solicitar información" → WhatsApp | Activo |
| **Restaurante** | `restaurante` | 🍽️ | "Agendar demo gratis" → WhatsApp | Activo |
| **Veterinaria & Clínicas** | `veterinaria` | 🐾 | "Próximamente" (sin `href`, `cta.href: null`) | **`comingSoon: true`** |

Texto verbatim de restaurante y veterinaria (los 2 verticales mencionados explícitamente por el usuario, además de "retail" que se reparte entre tienda/papelería/tlapalería):

**Restaurante** (`App.jsx:142-161`):
- Desc: "Controla mesas, comandas y cocina desde un solo sistema. Ideal para restaurantes y fondas."
- Features: "Plano de salón con estado de mesas en tiempo real" · "Comandas digitales directo a cocina" · "Pantalla KDS para el equipo de cocina" · "Modificadores de platillos (sin pepino, extra queso)" · "División de cuenta y propina integrada" · "Comandas digitales a pantalla de cocina (KDS)" *(nota: esta línea duplica la anterior — mismo texto casi idéntico dos veces en el array de features)* · "Rol especializado 'Cocina', separado de caja" · "Combos y paquetes con precio especial" · "Control de insumos ligado al inventario"

**Veterinaria & Clínicas** (`App.jsx:163-179`):
- Desc: "Expediente clínico conectado a tu punto de venta."
- Features: "Expediente por paciente, vinculado al dueño" · "Historial de citas y eventos preventivos" · "Recetas y seguimiento de tratamiento" · "Rol clínico independiente del área de caja" · "Compatible con facturación CFDI 4.0 (add-on)"
- `comingSoon: true` → se muestra un badge "Próximamente" en vez de CTA funcional.

**Contradicción de copy a notar:** el FAQ (`App.jsx:76-79`) dice *"¿Ya está listo para restaurantes? — Sí, puede configurarse para la operación de este giro."* y el screenshot `veterinaria-menu.png` existe en assets pero no se usa en ningún componente, mientras el propio giro de veterinaria está marcado `comingSoon: true` con CTA deshabilitado. Esto es una inconsistencia de estado/copy a resolver en el rediseño, no una decisión de diseño intencional documentada en otro lado.

Retail no es un giro único: está repartido en 3 tarjetas separadas (Tienda, Papelería, Tlapalería), cada una con su propio copy y features casi idénticos (mismo patrón de "control de inventario/ventas/proveedores", variando el rubro).

---

## 5. Precios y planes

Todos los precios están **hardcodeados directamente en componentes/constantes JS**, no vienen de una API ni de un JSON externo ni de config del backend.

### 5.1 Planes POS (suscripción del sistema)
Fuente: `src/constants/plans.js:1-65` (array `PLANS`), consumido por `src/components/PricingSection.jsx:3` (filtra `basico`, `premium`, `enterprise`) y por `CheckoutModal.jsx:2,61-68`.

| Plan | Mensual | Anual | Ahorro anual | Sucursales incluidas | Sucursal extra |
|---|---|---|---|---|---|
| Básico | $349 | $3,490 | $698 | 1 | +$149/mes |
| Premium (badge "Más popular") | $699 | $6,990 | $1,398 | 3 | +$129/mes |
| Enterprise (badge "Completo") | $999 | $9,990 | $1,998 | 5 | +$99/mes |

Add-on de facturación CFDI: `+$149 MXN/mes` hardcodeado en `App.jsx:815` y también en el objeto que se agrega al carrito (`App.jsx:820,827`, `id: 'cfdi-addon', price: 149`).

### 5.2 Planes de Páginas Web (Ankode Webs)
Hay **tres fuentes distintas y no compartidas** con datos ligeramente diferentes entre sí — sin single source of truth:

1. `src/components/landing/WebPlansSection.jsx:1-49` (array `PLANS` local al componente, sección del home):
   - Básico: setup $1,990 · hosting $299/mes o $2,490/año · cobro inicial con IVA $2,655.24 · entrega 5 días hábiles
   - Avanzado: setup $6,990 · hosting $499/mes o $4,990/año · cobro inicial con IVA **$8,668.84** · entrega 15 días hábiles

2. `src/pages/WebServiceOrder.jsx:4-47` (`BASICO`, `AVANZADO`, página `/paginas-web`):
   - Básico: mismo setup/hosting; IVA mensual $2,655.24, IVA anual $5,776.80
   - Avanzado: mismo setup/hosting; IVA mensual **$8,687.24** (⚠️ distinto a los $8,668.84 de `WebPlansSection.jsx`), IVA anual $13,896.80

3. `src/pages/WebContratar.jsx:10-13` (`PLAN_CONFIG`, usado para el cobro real en el flujo de pago):
   - `basico.totalWithIva = 2655.24`
   - `avanzado.totalWithIva = 8687.24` (coincide con `WebServiceOrder.jsx`, no con `WebPlansSection.jsx`)

4. `src/components/web-order/TermsModal.jsx:3-6` (`PLAN_INFO`, paso 1 del flujo):
   - `avanzado.iva = '$8,668.84'` (⚠️ coincide con `WebPlansSection.jsx`, NO con `WebContratar.jsx`/`WebServiceOrder.jsx` — es decir, **al usuario se le muestra $8,668.84 en el paso 1 del flujo de contratación y luego se le cobra $8,687.24 en el paso 3**, ya que `WebPaymentStep.jsx` recibe `amount` desde `WebContratar.jsx`'s `PLAN_CONFIG`).

**Hallazgo crítico para el rediseño:** el monto mostrado en `TermsModal` (paso 1, "Cobro inicial: $8,668.84") no coincide con el monto realmente cobrado en `WebPaymentStep` (paso 3, calculado desde `PLAN_CONFIG.avanzado.totalWithIva = 8687.24`). Diferencia de $18.40 MXN entre lo que se le informa al cliente y lo que se le cobra. Esto debe corregirse o al menos unificarse a una sola fuente de verdad al rediseñar.

### 5.3 Sección "Ankode Webs" en el home — ¿tiene precio visible?

Sí. `WebPlansSection.jsx` (renderizada en `App.jsx:856`, dentro del home) **sí muestra precios completos**: setup, hosting, cobro inicial con IVA y lo que incluye/no incluye cada plan, con CTA a `/paginas-web?plan={id}`. No es un teaser sin precio — es una tarjeta de pricing completa, igual de detallada que la sección de planes POS.

---

## 6. Integración con backend (CRÍTICO)

Todas las llamadas usan `fetch` nativo (no axios). Variable de entorno `VITE_API_URL`, con fallback hardcodeado a `https://api.ankode.cloud` repetido en **4 archivos distintos** (no hay un único módulo de config de API):
- `src/services/openpayService.js:1`
- `src/pages/WebContratar.jsx:8`
- `src/components/web-order/WebPaymentStep.jsx:4`
- `src/pages/PagoResultado.jsx:3`
- `src/pages/WebSuccessScreen.jsx:4`

### 6.1 Llamadas a API identificadas

| Endpoint | Método | Archivo:línea | Propósito |
|---|---|---|---|
| `${API_BASE}/api/openpay/checkout` | POST | `src/services/openpayService.js:45` | Checkout de planes POS / carrito (llamado desde `CheckoutModal.jsx:115`) |
| `${API_BASE}/api/web-services/orders` | POST | `src/pages/WebContratar.jsx:85` | Crear orden de página web (paso 2 del flujo `/paginas-web/contratar`) |
| `${API_BASE}/api/web-services/orders/${orderId}/pay` | POST | `src/components/web-order/WebPaymentStep.jsx:78` | Cobro Openpay de la orden de página web (paso 3) |
| `${API_BASE}/api/web-services/orders/${orderId}` | GET | `src/pages/WebSuccessScreen.jsx:112` | Polling de estado de la orden tras pago (página `/paginas-web/gracias`) |
| `${API_BASE}/api/onboarding/status?order_id=...` / `?charge_id=...` | GET | `src/pages/PagoResultado.jsx:167` | Polling de aprovisionamiento de cuenta tras pago (página `/pago-resultado`) |

### 6.2 Integración Openpay

Centralizada en `src/services/openpayService.js`:
- `loadOpenpayScripts()` (línea 6): inyecta `https://js.openpay.mx/openpay.v1.min.js` y `openpay-data.v1.min.js`, configura `OpenPay.setId`, `setApiKey`, `setSandboxMode` con `VITE_OPENPAY_MERCHANT_ID` / `VITE_OPENPAY_PUBLIC_KEY` / `VITE_OPENPAY_SANDBOX`. **Fallback de credenciales de producción hardcodeadas en el código fuente** (`openpayService.js:2-3`, comentario `// PROD fallback`) — si las env vars no están seteadas, usa merchant ID y public key de producción reales embebidos en el bundle del cliente. Esto es esperable para una public key de Openpay (está diseñada para ser pública), pero vale la pena confirmarlo con el equipo antes del rediseño ya que es una dependencia dura del build.
- `tokenizeCard(cardData)` (línea 27): llama a `window.OpenPay.token.create`.
- `submitCheckout(payload)` (línea 38): hace el POST a `/api/openpay/checkout`.

Puntos de uso de Openpay en la UI:
- `CheckoutModal.jsx` (modal del home): cargas de script en `useEffect` (línea 45-49), tokenización (línea 105-112), submit (línea 115-129).
- `WebPaymentStep.jsx` (paso 3 de `/paginas-web/contratar`): carga en `useEffect` (línea 45-49), tokenización (línea 69-76), POST directo a `/api/web-services/orders/${orderId}/pay` (línea 78-82).

**Nota de seguridad a documentar (no corregida, solo lectura):** `CheckoutModal.jsx:102` hace `console.log('CARD DATA:', JSON.stringify({ number: cardData.number, expMonth, expYear, cvv, name }))` — **loguea el número de tarjeta y CVV en texto plano a la consola del navegador** antes de tokenizar. Esto contradice el mensaje de UI que dice "Ankode nunca almacena tus datos de pago" (línea 514) y debería eliminarse, aunque no se modificó nada en esta fase de solo investigación. `openpayService.js:32` también loguea la respuesta completa del token (`console.log('TOKEN OK:', response)`), lo cual es menos sensible pero también innecesario en producción.

### 6.3 Otros elementos con envío de datos / leads
- Formularios `BasicForm.jsx` y `AdvancedForm.jsx` no llaman a la API directamente — devuelven los datos vía `onSubmit(finalData)` a `WebContratar.jsx`, que es quien hace el POST real.
- No hay formularios de "lead capture" genéricos (contacto, newsletter) en el home — el "contacto" es siempre un link `mailto:` o `wa.me` (`buildWhatsAppLink` / `buildMailtoLink` en `App.jsx:22-26`), no un formulario propio con backend.
- `localStorage.getItem('ankode_token')` se usa en `openpayService.js:41` para adjuntar `Authorization: Bearer` al checkout — indica que existe algún flujo de sesión/login compartido con el POS, aunque no hay código de login en este repo (coherente con que comparte DB/backend con el POS).

---

## 7. Estilos actuales

### 7.1 Colores reales (valores hex)

**`src/index.css` `:root`** (líneas 8-19):
```
--bg: #f7f8fc
--bg-soft: #eef1f8
--surface: #ffffff
--surface-2: #f3f5fb
--text: #1d2433
--text-strong: #111827
--muted: #5f6b85
--border: #e5eaf5
--purple: #6d4aff
--purple-dark: #5634de
--green: #19c37d
--green-soft: #dbf7ea
--shadow: 0 18px 48px rgba(55, 72, 112, 0.12)
--radius: 24px
```

**`src/App.css` `:root`** (líneas 8-20):
```
--bg: #f7f8fc
--bg-soft: #eef1f8
--surface: #ffffff
--surface-2: #f3f5fb
--text: #1d2433
--muted: #667085          ← valor distinto al de index.css (#5f6b85)
--border: #e5eaf5
--purple: #6d4aff
--purple-dark: #5634de
--green: #19c37d
--green-soft: #dbf7ea
--shadow: 0 18px 48px rgba(55, 72, 112, 0.12)
--radius: 24px
```

**Confirmado: `--text-strong` NO existe en `App.css` `:root`** (línea 12-13 salta directo de `--text` a `--muted`, sin declarar `--text-strong`). Sí existe en `index.css:13` con valor `#111827`. Como `main.jsx` importa `index.css` globalmente en todas las rutas (línea 3) y `App.jsx` importa además `App.css` (línea 1) solo cuando se renderiza la ruta `/`, en la práctica `--text-strong` sigue resolviendo porque `index.css` se carga siempre primero — pero es una inconsistencia real de mantenimiento: si `App.css` se usara alguna vez de forma aislada (sin `index.css`), `var(--text-strong)` (usado en `App.jsx:814`, `WebPlansSection.jsx:83,86,87`) quedaría sin valor. También hay un segundo hallazgo no mencionado por el usuario: **`--muted` tiene dos valores distintos** entre los dos archivos (`#5f6b85` en `index.css` vs `#667085` en `App.css`), lo cual sí puede causar diferencias visuales sutiles según qué stylesheet gane la cascada para cada elemento.

### 7.2 Duplicación index.css / App.css

Confirmado por conteo de líneas:
- `src/index.css`: **974 líneas**
- `src/App.css`: **1040 líneas**

Ambos declaran su propio bloque `:root` casi idéntico, ambos declaran `font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` en `:root` (`index.css:2`, `App.css:2`), y ambos tienen reglas base duplicadas (`* { box-sizing: border-box; }`, `html { overflow-x: hidden; }`, `html { scroll-behavior: smooth; }`, `body { margin: 0; background: ... }` — verificado idéntico en las primeras ~40 líneas de cada archivo). Es deuda técnica real y confirmada, tal como se indicaba en el contexto de la tarea.

### 7.3 Tipografía

- **CSS real usado:** `font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` (declarado en `:root` de ambos CSS files).
- **`index.html:7-9`** precarga y declara un `<link>` a Google Fonts para **`DM Serif Display` y `DM Sans`** — pero ninguna de las dos se referencia en ningún `font-family` del CSS. Es decir, **se están descargando fuentes de Google Fonts que no se usan en absoluto**, mientras la tipografía real (`Inter`) ni siquiera está pre-cargada vía `<link>` (depende de que el sistema operativo la tenga o cae al fallback `system-ui`). Esto es una oportunidad de limpieza/performance a considerar en el rediseño, no mencionada explícitamente por el usuario pero relevante para la sección de estilos.

---

## 8. Assets

| Asset | Ruta | Uso |
|---|---|---|
| Logo Ankode | `src/assets/ankode-logo.png` | Header del home (`App.jsx:2,453`), header de `WebServiceOrder.jsx:2,168`, header de `WebContratar.jsx:2,119`, `WebSuccessScreen.jsx:2,77` (nota: `PagoResultado.jsx` usa un logo SVG inline propio, no este PNG — ver `PagoResultado.jsx:119-130`) |
| `ventas-retail.png` | `src/assets/screenshots/` | Screenshot "Ventas · Retail" (`App.jsx:3,183`) |
| `cocina-kds.png` | `src/assets/screenshots/` | Screenshot "Cocina · Pantalla en vivo (KDS)" (`App.jsx:4,184`) |
| `comanda-mesa.png` | `src/assets/screenshots/` | Screenshot "Comanda digital" (`App.jsx:5,185`) |
| `dashboard.png` | `src/assets/screenshots/` | Screenshot "Reportes y resumen operativo" (`App.jsx:6,186`) |
| `kits.png` | `src/assets/screenshots/` | Screenshot "Combos y kits" (`App.jsx:7,187`) |
| `veterinaria-menu.png` | `src/assets/screenshots/` | **Existe en disco pero no se importa ni se usa en ningún componente** — asset huérfano |

Íconos: no hay librería de íconos (no hay lucide-react, heroicons, etc. en `package.json`). Todos los íconos son SVG inline hechos a mano: `CartIcon` (`App.jsx:190-232`), `ModuleIcon` (`App.jsx:234-314`, switch con 8 casos: sales/inventory/suppliers/credit/finance/reminders/support/access), logo SVG inline de `PagoResultado.jsx:119-130`, badge SVG de Openpay repetido igual en `CheckoutModal.jsx:509-513` y `WebPaymentStep.jsx:222-226`. Emojis Unicode se usan directamente como "iconos" de giro en `App.jsx:86-180` (🏪📋🔧🍽️🐾) y en pasos de "cómo funciona" (📋💬💳📸🚀 en `WebServiceOrder.jsx:50-55` y en el componente muerto `HowItWorks.jsx:1-7`).

---

## Resumen de hallazgos para decisión de rediseño

1. **No hay separación real de verticales** — "Por giro" es un único acordeón con 5 items (no 3), mezclando retail/papelería/tlapalería/restaurante/veterinaria en el mismo componente y mismo patrón visual.
2. **Veterinaria está marcada `comingSoon: true`** pero el FAQ y otros textos la presentan como disponible — inconsistencia de estado a resolver.
3. **Tres fuentes de precios de Páginas Web desincronizadas**, con una discrepancia real de $18.40 MXN entre lo que se muestra en el paso 1 del checkout (`TermsModal.jsx`, $8,668.84) y lo que se cobra en el paso 3 (`WebContratar.jsx`/`WebPaymentStep.jsx`, $8,687.24).
4. **`HowItWorks.jsx` es código muerto** — no importado en ningún lado.
5. **`veterinaria-menu.png` es un asset huérfano** — no se usa en ningún componente.
6. **CSS duplicado y parcialmente inconsistente** entre `index.css`/`App.css` (974 vs 1040 líneas), confirmado ausencia de `--text-strong` en `App.css` y valor distinto de `--muted` entre ambos.
7. **Fuentes Google Fonts cargadas (`DM Serif Display`, `DM Sans`) pero no usadas** — el CSS real usa `Inter`.
8. **`console.log` de número de tarjeta y CVV en texto plano** en `CheckoutModal.jsx:102` antes de tokenizar — contradice el propio copy de seguridad mostrado al usuario.
9. **`API_BASE` con fallback a `https://api.ankode.cloud` repetido en 5 archivos** sin módulo central de config.
10. Sección "Ankode Webs" del home (`WebPlansSection.jsx`) **ya muestra precio completo**, no es un teaser.
