import { ItineraryData } from '../types/travel';

export function exportToPDF(data: ItineraryData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para exportar el PDF.');
    return;
  }

  const newsHTML = data.resumen.noticias_relevantes?.length
    ? `<div class="section">
        <h2>📰 Noticias Relevantes</h2>
        <ul>
          ${data.resumen.noticias_relevantes.map((n: any) => {
            const titulo = typeof n === 'string' ? n : n.titulo;
            const url = typeof n === 'string' ? '' : (n.url || '');
            return `<li>${url ? `<a href="${url}" target="_blank">${titulo}</a>` : titulo}</li>`;
          }).join('')}
        </ul>
      </div>`
    : '';

  const alertsHTML = data.advertencias?.length
    ? `<div class="section">
        <h2>⚠️ Alertas</h2>
        ${data.advertencias.map(a => `
          <div class="alert alert-${a.severidad}">
            <strong>${a.tipo}</strong>: ${a.mensaje}
          </div>
        `).join('')}
      </div>`
    : '';

  const itineraryHTML = data.itinerario?.map(day => `
    <div class="day-card">
      <h2>${day.dia}</h2>
      <div class="weather-badge">🌤 ${data.resumen.clima_general}</div>
      ${day.actividades?.map(act => `
        <div class="activity">
          <div class="time">${act.hora}</div>
          <div class="activity-content">
            <h3>${act.lugar}</h3>
            <p>${act.descripcion}</p>
            <p class="tip">💡 ${act.consejo_ia}</p>
            <span class="cost">${act.coste_estimado}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  const adviceHTML = data.consejos_generales?.length
    ? `<div class="section">
        <h2>🤖 Consejos Generales</h2>
        <ul>
          ${data.consejos_generales.map(c => `<li><strong>${c.categoria}:</strong> ${c.mensaje}</li>`).join('')}
        </ul>
      </div>`
    : '';

  const budgetHTML = data.presupuesto_estimado
    ? `<div class="section">
        <h2>💰 Presupuesto Estimado</h2>
        <table>
          <tr><td>Transporte</td><td class="amount">${data.presupuesto_estimado.transporte}</td></tr>
          <tr><td>Alimentación</td><td class="amount">${data.presupuesto_estimado.alimentacion}</td></tr>
          <tr><td>Entradas</td><td class="amount">${data.presupuesto_estimado.entradas}</td></tr>
          <tr class="total"><td><strong>Total</strong></td><td class="amount"><strong>${data.presupuesto_estimado.total}</strong></td></tr>
        </table>
      </div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Voyager AI — ${data.resumen.destino}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1a1a2e;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #667eea;
    }
    .header h1 { font-size: 32px; color: #667eea; margin-bottom: 4px; }
    .header .subtitle { color: #666; font-size: 14px; }
    .header .dates { color: #888; font-size: 13px; margin-top: 4px; }

    .section { margin-bottom: 24px; }
    .section h2 { font-size: 18px; color: #333; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
    .section ul { padding-left: 20px; }
    .section li { margin-bottom: 6px; font-size: 13px; }
    .section a { color: #667eea; text-decoration: none; }

    .alert { padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; }
    .alert-alta { background: #fee2e2; border-left: 4px solid #ef4444; }
    .alert-media { background: #fef3c7; border-left: 4px solid #f59e0b; }
    .alert-baja { background: #dbeafe; border-left: 4px solid #3b82f6; }

    .day-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .day-card h2 { font-size: 18px; color: #1a1a2e; margin-bottom: 8px; border: none; padding: 0; }
    .weather-badge {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      margin-bottom: 16px;
    }

    .activity {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .activity:last-child { border-bottom: none; }
    .time { color: #667eea; font-weight: 700; font-size: 14px; min-width: 50px; padding-top: 2px; }
    .activity-content { flex: 1; }
    .activity-content h3 { font-size: 15px; margin-bottom: 2px; }
    .activity-content p { font-size: 13px; color: #555; margin-bottom: 4px; }
    .tip { color: #667eea; font-style: italic; font-size: 12px !important; }
    .cost { background: #eef2ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }

    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
    .amount { text-align: right; }
    .total td { border-top: 2px solid #667eea; border-bottom: none; }

    .footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #eee; color: #aaa; font-size: 11px; }

    @media print {
      body { padding: 20px; }
      .day-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✈️ ${data.resumen.destino}</h1>
    <div class="subtitle">Itinerario generado por Voyager AI</div>
    <div class="dates">${data.resumen.fecha_inicio} — ${data.resumen.fecha_fin} • ${data.itinerario.length} días</div>
  </div>

  ${alertsHTML}
  ${newsHTML}
  ${itineraryHTML}
  ${adviceHTML}
  ${budgetHTML}

  <div class="footer">
    Generado por Voyager AI • ${new Date().toLocaleDateString('es-ES')}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
