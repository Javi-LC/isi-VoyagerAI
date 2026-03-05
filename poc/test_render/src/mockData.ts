/**
 * JSON estático de prueba que simula la respuesta del backend.
 * Usado para demostrar el renderizado sin necesidad de backend.
 */
export const MOCK_RESPONSE = {
  resumen: {
    destino: "Berlín, Alemania",
    fecha_inicio: "2026-03-25",
    fecha_fin: "2026-03-27",
    clima_general:
      "Cielos parcialmente nublados con temperaturas entre 3°C y 9°C. Sin precipitaciones significativas.",
    noticias_relevantes: [
      "El metro U2 tendrá interrupciones por obras hasta abril.",
      "Festival de luces en la Puerta de Brandenburgo este fin de semana.",
    ],
  },
  advertencias: [
    {
      tipo: "transporte",
      icono: "alert-triangle",
      severidad: "media",
      mensaje:
        "Corte por obras en la línea U2 del U-Bahn entre Alexanderplatz y Potsdamer Platz. Se recomienda utilizar la línea S1 como alternativa.",
    },
    {
      tipo: "clima",
      icono: "wind",
      severidad: "baja",
      mensaje:
        "Ráfagas de viento de hasta 30 km/h previstas para el día 26. Llevar ropa de abrigo.",
    },
  ],
  itinerario: [
    {
      dia: "Día 1 — 25 de Marzo",
      actividades: [
        {
          hora: "09:30",
          lugar: "Puerta de Brandenburgo",
          tipo_icono: "landmark",
          descripcion: "Icónico monumento neoclásico, símbolo de la reunificación alemana.",
          consejo_ia: "Llega temprano para evitar multitudes. La luz matutina es ideal para fotografías.",
          coste_estimado: "Gratis",
        },
        {
          hora: "11:00",
          lugar: "Museo de la Tecnología",
          tipo_icono: "cpu",
          descripcion: "Colección interactiva de historia de la computación y la aviación.",
          consejo_ia: "Compra la entrada combinada online para evitar las colas. Sección de aviación cierra a las 15:00.",
          coste_estimado: "8€",
        },
        {
          hora: "13:30",
          lugar: "Markthalle Neun",
          tipo_icono: "utensils",
          descripcion: "Mercado gastronómico con opciones vegetarianas y street food local.",
          consejo_ia: "El jueves es 'Street Food Thursday', el día más animado. Prueba los Spätzle veganos.",
          coste_estimado: "12€",
        },
        {
          hora: "15:30",
          lugar: "East Side Gallery",
          tipo_icono: "palette",
          descripcion: "Galería al aire libre en un tramo preservado del Muro de Berlín.",
          consejo_ia: "Recórrela de sur a norte para seguir el orden cronológico de los murales.",
          coste_estimado: "Gratis",
        },
      ],
    },
    {
      dia: "Día 2 — 26 de Marzo",
      actividades: [
        {
          hora: "10:00",
          lugar: "Isla de los Museos",
          tipo_icono: "landmark",
          descripcion: "Complejo de cinco museos declarado Patrimonio de la Humanidad.",
          consejo_ia: "El pase de día (19€) incluye todos los museos. Empieza por el Pergamon si te interesa la historia antigua.",
          coste_estimado: "19€",
        },
        {
          hora: "14:00",
          lugar: "Currywurst en Curry 36",
          tipo_icono: "utensils",
          descripcion: "Icónica salchicha berlinesa con salsa curry.",
          consejo_ia: "Pide la versión 'ohne Darm' (sin tripa) que es la más popular entre locales.",
          coste_estimado: "5€",
        },
        {
          hora: "16:00",
          lugar: "Tiergarten",
          tipo_icono: "tree-pine",
          descripcion: "El mayor parque urbano de Berlín, ideal para pasear.",
          consejo_ia: "Lleva el cortavientos hoy: se esperan ráfagas de 30 km/h.",
          coste_estimado: "Gratis",
        },
      ],
    },
  ],
  consejos_generales: [
    {
      icono: "wind",
      categoria: "clima",
      mensaje: "Lleva un cortavientos; las zonas abiertas cerca del río Spree tendrán ráfagas frías.",
    },
    {
      icono: "credit-card",
      categoria: "presupuesto",
      mensaje: "La Berlin WelcomeCard (AB) cuesta 23€ para 3 días e incluye transporte público y descuentos en museos.",
    },
    {
      icono: "train",
      categoria: "transporte",
      mensaje: "El billete sencillo del U-Bahn cuesta 3,20€. Para estancias largas, usa la Tageskarte (día) por 8,80€.",
    },
  ],
  presupuesto_estimado: {
    transporte: "23€",
    alimentacion: "90€",
    entradas: "35€",
    total: "148€",
  },
};
