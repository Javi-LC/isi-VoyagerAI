import { ItineraryData } from '../types/travel';

export function exportToPDF(data: ItineraryData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para exportar el PDF.');
    return;
  }

  const newsHTML = data.resumen.noticias_relevantes?.length
    ? `<div class="section">
        <h2 class="section-title">Noticias Relevantes</h2>
        <ul class="news-list">
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
        <h2 class="section-title">Alertas</h2>
        ${data.advertencias.map(a => `
          <div class="alert alert-${a.severidad}">
            <strong>${a.tipo.toUpperCase()}</strong> &bull; ${a.mensaje}
          </div>
        `).join('')}
      </div>`
    : '';

  const itineraryHTML = data.itinerario?.map(day => `
    <div class="day-card">
      <div class="day-header">
        <h2>${day.dia}</h2>
        <span class="weather-badge">🌤 ${data.resumen.clima_general}</span>
      </div>
      <div class="timeline">
        ${day.actividades?.map(act => `
          <div class="activity">
            <div class="time">${act.hora}</div>
            <div class="activity-content">
              <h3>${act.lugar}</h3>
              <p>${act.descripcion}</p>
              ${act.consejo_ia ? `<div class="tip">💡 <strong>Consejo IA:</strong> ${act.consejo_ia}</div>` : ''}
              ${act.coste_estimado ? `<div class="cost">Coste estimado: ${act.coste_estimado}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const adviceHTML = data.consejos_generales?.length
    ? `<div class="section page-break-before">
        <h2 class="section-title">Consejos Generales</h2>
        <div class="advice-grid">
          ${data.consejos_generales.map(c => `
            <div class="advice-card">
              <div class="advice-category">${c.categoria.toUpperCase()}</div>
              <p>${c.mensaje}</p>
            </div>
          `).join('')}
        </div>
      </div>`
    : '';

  const budgetHTML = data.presupuesto_estimado
    ? `<div class="section budget-section">
        <h2 class="section-title">Presupuesto Estimado</h2>
        <table class="budget-table">
          <tr><td>Transporte</td><td class="amount">${data.presupuesto_estimado.transporte}</td></tr>
          <tr><td>Alimentación</td><td class="amount">${data.presupuesto_estimado.alimentacion}</td></tr>
          <tr><td>Entradas</td><td class="amount">${data.presupuesto_estimado.entradas}</td></tr>
          <tr class="total"><td>TOTAL ESTIMADO</td><td class="amount">${data.presupuesto_estimado.total}</td></tr>
        </table>
      </div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Voyager AI — ${data.resumen.destino}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* CSS Print Reset para quitar headers/footers del navegador ("about:blank") */
    @page { 
      margin: 0; 
      size: A4;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #334155;
      line-height: 1.6;
      background-color: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Contenedor principal simulando los márgenes del folio */
    .document {
      padding: 15mm 20mm;
      max-width: 210mm; /* A4 width */
      margin: 0 auto;
    }

    /* Cabecera Premium */
    .header-banner {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      padding: 30px 40px;
      border-radius: 16px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header-banner h1 { 
      font-size: 32px; 
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    .header-banner .subtitle { 
      color: #e0e7ff; 
      font-size: 15px; 
      font-weight: 500;
    }
    .header-banner .dates { 
      display: inline-block;
      margin-top: 16px;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }

    /* Tipografía de Secciones */
    .section { margin-bottom: 32px; }
    .section-title { 
      font-size: 20px; 
      color: #1e293b; 
      font-weight: 700;
      margin-bottom: 16px; 
      padding-bottom: 8px; 
      border-bottom: 2px solid #e2e8f0; 
    }

    /* Alertas */
    .alert { 
      padding: 14px 18px; 
      border-radius: 10px; 
      margin-bottom: 10px; 
      font-size: 14px; 
    }
    .alert-alta { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
    .alert-media { background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; }
    .alert-baja { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }

    /* Noticias */
    .news-list { padding-left: 0; list-style: none; }
    .news-list li { 
      margin-bottom: 10px; 
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 14px; 
      border-left: 3px solid #6366f1;
    }
    .news-list a { color: #4f46e5; text-decoration: none; font-weight: 500; }

    /* Itinerario - Estilo Timeline */
    .day-card {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f1f5f9;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .day-header h2 { font-size: 18px; color: #0f172a; font-weight: 700; }
    .weather-badge {
      font-size: 13px;
      color: #475569;
      font-weight: 500;
    }

    .timeline {
      padding-left: 20px;
    }
    .activity {
      display: flex;
      gap: 24px;
      padding-bottom: 24px;
      position: relative;
    }
    /* Línea vertical del timeline */
    .activity::before {
      content: '';
      position: absolute;
      left: 60px;
      top: 24px;
      bottom: 0;
      width: 2px;
      background: #e2e8f0;
    }
    .activity:last-child::before { display: none; }
    
    .time { 
      color: #6366f1; 
      font-weight: 700; 
      font-size: 15px; 
      min-width: 45px; 
      padding-top: 2px; 
    }
    .activity-content { 
      flex: 1; 
      background: #fff;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 12px;
    }
    .activity-content h3 { font-size: 16px; color: #0f172a; margin-bottom: 6px; }
    .activity-content p { font-size: 14px; color: #475569; margin-bottom: 12px; }
    
    .tip { 
      background: #fefce8; 
      padding: 10px 14px; 
      border-radius: 8px; 
      font-size: 13px; 
      color: #854d0e;
      margin-bottom: 8px;
    }
    .cost { 
      display: inline-block;
      background: #f1f5f9; 
      color: #334155; 
      padding: 4px 10px; 
      border-radius: 6px; 
      font-size: 12px; 
      font-weight: 600; 
    }

    /* Consejos Grid */
    .advice-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .advice-card {
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      page-break-inside: avoid;
    }
    .advice-category {
      font-size: 11px;
      font-weight: 700;
      color: #6366f1;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .advice-card p { font-size: 13px; color: #334155; }

    /* Presupuesto */
    .budget-section { page-break-inside: avoid; }
    .budget-table { 
      width: 100%; 
      border-collapse: separate; 
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .budget-table td { 
      padding: 12px 20px; 
      font-size: 14px; 
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
    }
    .budget-table tr:last-child td { border-bottom: none; }
    .budget-table .amount { text-align: right; font-weight: 600; color: #0f172a; }
    .total td { 
      background: #f8fafc; 
      font-weight: 700; 
      color: #0f172a;
      font-size: 15px;
    }

    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #e2e8f0; 
      color: #94a3b8; 
      font-size: 12px; 
    }

    .page-break-before { page-break-before: always; }

  </style>
</head>
<body>
  <div class="document">
    <div class="header-banner">
      <h1>✈️ ${data.resumen.destino}</h1>
      <div class="subtitle">Itinerario personalizado generado por Voyager AI</div>
      <div class="dates">${data.resumen.fecha_inicio} al ${data.resumen.fecha_fin} • ${data.itinerario.length} días</div>
    </div>

    ${alertsHTML}
    ${newsHTML}
    ${itineraryHTML}
    ${adviceHTML}
    ${budgetHTML}

    <div class="footer">
      Documento generado automáticamente por Voyager AI • ${new Date().toLocaleDateString('es-ES')}
    </div>
  </div>

  <script>
    // Pequeño delay para que carguen las fuentes antes de imprimir
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
