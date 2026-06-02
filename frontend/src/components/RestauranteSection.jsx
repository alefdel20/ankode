import React from "react";
import "./RestauranteSection.css";

const features = [
  { icon: "🗺️", title: "Plano de salón", desc: "Visualiza el estado de cada mesa en tiempo real. Asigna meseros y cambia estados con un toque." },
  { icon: "📋", title: "Comandas digitales", desc: "El mesero toma el pedido en el POS y llega directo a cocina. Sin papel, sin gritos, sin errores." },
  { icon: "📺", title: "Pantalla de cocina (KDS)", desc: "El equipo de cocina ve los pedidos en orden de llegada. Marca platillos listos desde cualquier pantalla." },
  { icon: "🧾", title: "CFDI 4.0 por mesa", desc: "Genera la factura timbrada al cerrar la cuenta. División de cuenta y propina incluidos." },
  { icon: "⚙️", title: "Modificadores de platillos", desc: "Sin pepino, extra queso, término medio. Personaliza cada orden sin abrir otra app." },
  { icon: "👥", title: "Roles por persona", desc: "Mesero solo ve sus mesas. Gerente tiene vista completa. Caja solo cobra. Control total." },
];

const tables = [
  { num: "01", estado: "libre" },
  { num: "02", estado: "ocupada" },
  { num: "03", estado: "cuenta" },
  { num: "04", estado: "libre" },
  { num: "05", estado: "ocupada" },
  { num: "06", estado: "ocupada" },
  { num: "07", estado: "libre" },
  { num: "08", estado: "cuenta" },
];

const estadoLabels = { libre: "Libre", ocupada: "En servicio", cuenta: "Cuenta pedida" };

export default function RestauranteSection() {
  return (
    <section className="rk-section">
      <div className="rk-noise" aria-hidden="true" />
      <div className="rk-inner">

        <span className="rk-pill">🍽️ Vertical Restaurante</span>

        <h2 className="rk-headline">
          Tu restaurante, <em>sin el caos</em> operativo
        </h2>

        <p className="rk-sub">
          Desde la comanda hasta el CFDI 4.0, Ankode conecta sala, cocina y caja en un solo sistema.
          Sin papelitos, sin confusiones, sin perder una orden.
        </p>

        <div className="rk-mockup">
          <div className="rk-mockup-bar">
            <span className="rk-dot rk-dot-red" />
            <span className="rk-dot rk-dot-yellow" />
            <span className="rk-dot rk-dot-green" />
            <span className="rk-mockup-label">Ankode POS — Plano de salón</span>
          </div>
          <div className="rk-tables-grid">
            {tables.map((t) => (
              <div key={t.num} className={`rk-table-card ${t.estado}`}>
                <span className="rk-table-num">{t.num}</span>
                <span className="rk-table-estado">{estadoLabels[t.estado]}</span>
              </div>
            ))}
          </div>
          <div className="rk-legend">
            <span><span className="rk-legend-dot" style={{ background: "#4ade80" }} />Libre</span>
            <span><span className="rk-legend-dot" style={{ background: "#ff8232" }} />En servicio</span>
            <span><span className="rk-legend-dot" style={{ background: "#facc15" }} />Cuenta pedida</span>
          </div>
        </div>

        <div className="rk-features-grid">
          {features.map((f) => (
            <div key={f.title} className="rk-feature-card">
              <div className="rk-feature-icon">{f.icon}</div>
              <p className="rk-feature-title">{f.title}</p>
              <p className="rk-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="rk-ctas">
          <a
            href="https://wa.me/525515133527?text=Hola%2C%20quiero%20una%20demo%20de%20Ankode%20para%20restaurante"
            target="_blank"
            rel="noopener noreferrer"
            className="rk-btn-primary"
          >
            📅 Agendar demo gratis
          </a>
          <a href="#precios" className="rk-btn-ghost">
            Ver precios →
          </a>
        </div>

      </div>
    </section>
  );
}
