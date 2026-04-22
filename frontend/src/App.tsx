"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LandingSection } from './components/LandingSection';
import { TripPlanner } from './components/TripPlanner';
import { ItineraryView } from './components/ItineraryView';
import { Footer } from './components/Footer';
import { ActiveSection, Preferences, ItineraryData } from './types/travel';

export default function TravelApp() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('landing');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferences, setPreferences] = useState<Preferences>({
    presupuesto: 'medio',
    restricciones: [],
    intereses: [],
  });
  const [showItinerary, setShowItinerary] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const handleSectionChange = useCallback((section: ActiveSection) => {
    window.history.pushState({ section }, '', `#${section}`);
    setActiveSection(section);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.section) {
        setActiveSection(event.state.section);
      } else {
        const hash = window.location.hash.replace('#', '') as ActiveSection;
        if (['landing', 'planner', 'itinerary'].includes(hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection('landing');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Configuración inicial al cargar la página
    if (!window.history.state) {
      const hash = window.location.hash.replace('#', '') as ActiveSection;
      const initialSection = ['landing', 'planner', 'itinerary'].includes(hash) ? hash : 'landing';
      window.history.replaceState({ section: initialSection }, '', `#${initialSection}`);
      setActiveSection(initialSection);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [itineraryData] = useState<ItineraryData>({
    resumen: {
      destino: 'Barcelona, España',
      fecha_inicio: '2026-03-25',
      fecha_fin: '2026-03-27',
      clima_general: 'Cielos parcialmente nublados, temperaturas entre 15°C y 20°C.',
      noticias_relevantes: [
        'El metro L2 tendrá interrupciones por obras hasta abril.',
      ],
    },
    advertencias: [
      {
        tipo: 'transporte',
        icono: 'alert-triangle',
        severidad: 'media',
        mensaje: 'Corte por obras en la línea L2 del metro. Se recomienda utilizar autobuses como alternativa.',
      },
      {
        tipo: 'clima',
        icono: 'cloud-rain',
        severidad: 'baja',
        mensaje: 'Posible lluvia ligera el segundo día. Actividades al aire libre podrían verse afectadas.',
      },
    ],
    itinerario: [
      {
        dia: 'Día 1 — 25 de Marzo',
        actividades: [
          {
            hora: '10:00',
            lugar: 'Sagrada Familia',
            tipo_icono: 'church',
            descripcion: 'Visita a la famosa basílica modernista de Gaudí.',
            consejo_ia: 'Compra la entrada online para evitar colas. La mejor hora es temprano por la mañana.',
            coste_estimado: '26€',
          },
          {
            hora: '13:30',
            lugar: 'La Boqueria Market',
            tipo_icono: 'utensils',
            descripcion: 'Mercado gastronómico con opciones locales y tapas.',
            consejo_ia: 'Prueba las tapas vegetarianas en los puestos del centro. Evita las horas pico.',
            coste_estimado: '15€',
          },
          {
            hora: '16:00',
            lugar: 'Park Güell',
            tipo_icono: 'tree-pine',
            descripcion: 'Parque modernista con vistas panorámicas de la ciudad.',
            consejo_ia: 'Lleva calzado cómodo para las escaleras. Visita al atardecer para mejores fotos.',
            coste_estimado: '10€',
          },
        ],
      },
      {
        dia: 'Día 2 — 26 de Marzo',
        actividades: [
          {
            hora: '11:00',
            lugar: 'Museo Picasso',
            tipo_icono: 'palette',
            descripcion: 'Colección de obras del artista Pablo Picasso.',
            consejo_ia: 'Reserva entrada con antelación. La colección permanente es extensa.',
            coste_estimado: '12€',
          },
          {
            hora: '14:00',
            lugar: 'Gothic Quarter',
            tipo_icono: 'building',
            descripcion: 'Barrio histórico con arquitectura medieval.',
            consejo_ia: 'Explora las callejuelas estrechas. Hay muchos cafés con terraza.',
            coste_estimado: 'Gratis',
          },
        ],
      },
    ],
    consejos_generales: [
      {
        icono: 'wind',
        categoria: 'clima',
        mensaje: 'Lleva una chaqueta ligera; las temperaturas pueden bajar por la noche.',
      },
      {
        icono: 'credit-card',
        categoria: 'presupuesto',
        mensaje: 'La Barcelona Card cuesta 45€ para 3 días e incluye transporte y descuentos.',
      },
    ],
    presupuesto_estimado: {
      transporte: '15€',
      alimentacion: '60€',
      entradas: '48€',
      total: '123€',
    },
  });

  const handleBudgetChange = (value: 'bajo' | 'medio' | 'alto') => {
    setPreferences(prev => ({ ...prev, presupuesto: value }));
  };

  const handleDietaryChange = (value: string) => {
    setPreferences(prev => ({ ...prev, restricciones: value.split(',').map(s => s.trim()) }));
  };

  const handleInterestsChange = (interest: string) => {
    setPreferences(prev => {
      const newInterests = prev.intereses.includes(interest)
        ? prev.intereses.filter(i => i !== interest)
        : [...prev.intereses, interest];
      return { ...prev, intereses: newInterests };
    });
  };

  const handleGenerateItinerary = () => {
    setShowItinerary(true);
    handleSectionChange('itinerary');
  };

  const handleBackToPlanner = () => {
    handleSectionChange('planner');
  };

  const handleToggleAlerts = () => {
    setShowAlerts(!showAlerts);
  };

  return (
    <div className="p-0 m-0 min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {activeSection === 'landing' && (
        <LandingSection onSectionChange={handleSectionChange} />
      )}

      {activeSection === 'planner' && (
        <TripPlanner
          origin={origin}
          onOriginChange={setOrigin}
          destination={destination}
          startDate={startDate}
          endDate={endDate}
          preferences={preferences}
          onDestinationChange={setDestination}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onBudgetChange={handleBudgetChange}
          onDietaryChange={handleDietaryChange}
          onInterestsChange={handleInterestsChange}
          onGenerateItinerary={handleGenerateItinerary}
        />
      )}

      {activeSection === 'itinerary' && (
        <ItineraryView
          itineraryData={itineraryData}
          showAlerts={showAlerts}
          onToggleAlerts={handleToggleAlerts}
          onBack={handleBackToPlanner}
        />
      )}

      <Footer />
    </div>
  );
}
