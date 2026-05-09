import { ItineraryData, Activity } from '../types/travel';

function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function generateUID(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36) + '@voyagerai.app';
}

export function exportToCalendar(data: ItineraryData) {
  if (!data.itinerario || data.itinerario.length === 0) return;

  const startDateParts = data.resumen.fecha_inicio.split('-');
  if (startDateParts.length !== 3) {
    alert("Error procesando las fechas del viaje para el calendario.");
    return;
  }

  // Create a base date at noon UTC to avoid timezone shifting issues
  const baseDate = new Date(Date.UTC(
    parseInt(startDateParts[0], 10),
    parseInt(startDateParts[1], 10) - 1,
    parseInt(startDateParts[2], 10),
    12, 0, 0
  ));

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Voyager AI//Itinerary Planner//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Viaje a ${data.resumen.destino}`
  ];

  data.itinerario.forEach((day, dayIndex) => {
    // Calculate the date for this specific day of the itinerary
    const currentDayDate = new Date(baseDate);
    currentDayDate.setUTCDate(baseDate.getUTCDate() + dayIndex);

    day.actividades.forEach((act: Activity) => {
      // Parse the time (assuming "HH:MM" format)
      const timeParts = act.hora.split(':');
      let startHours = 10;
      let startMinutes = 0;
      
      if (timeParts.length >= 2) {
        startHours = parseInt(timeParts[0], 10);
        startMinutes = parseInt(timeParts[1], 10);
      }

      // Start time
      const eventStart = new Date(currentDayDate);
      eventStart.setUTCHours(startHours, startMinutes, 0);

      // End time (assume 2 hours duration for each activity)
      const eventEnd = new Date(eventStart);
      eventEnd.setUTCHours(startHours + 2);

      // Format description to remove newlines or handle them properly for ICS
      let description = act.descripcion;
      if (act.consejo_ia) {
        description += `\\n\\n💡 Consejo Voyager: ${act.consejo_ia}`;
      }
      if (act.coste_estimado) {
        description += `\\n💰 Coste estimado: ${act.coste_estimado}`;
      }
      
      // Escape special characters for ICS
      description = description.replace(/,/g, '\\,').replace(/;/g, '\\;');
      const summary = act.lugar.replace(/,/g, '\\,').replace(/;/g, '\\;');
      let location = act.lugar.replace(/,/g, '\\,').replace(/;/g, '\\;');
      
      if (act.lat !== undefined && act.lng !== undefined) {
          // If we have coordinates, we can add them to the location or description
          location = `${location} (Geo: ${act.lat}\\, ${act.lng})`;
      }

      const now = new Date();

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${generateUID()}`,
        `DTSTAMP:${formatICSDate(now)}`,
        `DTSTART:${formatICSDate(eventStart)}`,
        `DTEND:${formatICSDate(eventEnd)}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT'
      );
    });
  });

  icsContent.push('END:VCALENDAR');

  // Create the blob and trigger download
  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Format destination for the filename
  const safeDestino = data.resumen.destino.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.href = url;
  link.setAttribute('download', `voyager-${safeDestino}.ics`);
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
