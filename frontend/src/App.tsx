"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LandingSection } from './components/LandingSection';
import { TripPlanner } from './components/TripPlanner';
import { ItineraryView } from './components/ItineraryView';
import { HistorySection } from './components/HistorySection';
import { Footer } from './components/Footer';
import { ActiveSection, Preferences, ItineraryData } from './types/travel';
import { generateTripPlan } from './lib/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);

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

  const handleGenerateItinerary = async () => {
    if (isLoading) return;
    if (!origin || !destination || !startDate || !endDate) {
      setError('Por favor rellena el origen, el destino y las fechas antes de continuar.');
      return;
    }
    setError(null);
    setIsLoading(true);
    handleSectionChange('itinerary');
    try {
      const data = await generateTripPlan({
        origen: origin,
        destino: destination,
        fechas: { inicio: startDate, fin: endDate },
        intereses: preferences.intereses,
        presupuesto: preferences.presupuesto,
        restricciones: preferences.restricciones.filter(Boolean),
      });
      setItineraryData(data);
      setShowItinerary(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al generar el itinerario.');
      handleSectionChange('planner');
    } finally {
      setIsLoading(false);
    }
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
        <>
          {error && (
            <div className="mx-auto mt-4 max-w-[800px] px-6">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                ⚠️ {error}
              </div>
            </div>
          )}
          <TripPlanner
            origin={origin}
            onOriginChange={setOrigin}
            destination={destination}
            startDate={startDate}
            endDate={endDate}
            preferences={preferences}
            isLoading={isLoading}
            onDestinationChange={setDestination}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onBudgetChange={handleBudgetChange}
            onDietaryChange={handleDietaryChange}
            onInterestsChange={handleInterestsChange}
            onGenerateItinerary={handleGenerateItinerary}
          />
        </>
      )}

      {activeSection === 'history' && (
        <HistorySection 
          onTripSelect={setItineraryData}
          onSectionChange={handleSectionChange}
        />
      )}

      {activeSection === 'itinerary' && (
        isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-indigo-600">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-lg font-medium">Generando tu itinerario con IA...</p>
            <p className="text-sm text-gray-500">Consultando clima, noticias y Gemini ✨</p>
          </div>
        ) : itineraryData ? (
          <ItineraryView
            itineraryData={itineraryData}
            showAlerts={showAlerts}
            onToggleAlerts={handleToggleAlerts}
            onBack={handleBackToPlanner}
          />
        ) : null
      )}

      <Footer />
    </div>
  );
}
