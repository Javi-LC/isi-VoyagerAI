import React, { useState, useEffect } from 'react';
import { getTripsHistory, getTripById, TripSummary } from '../lib/history';
import { ItineraryData } from '../types/travel';
import { Calendar, MapPin, Clock, Loader, AlertCircle } from 'lucide-react';

interface HistorySectionProps {
  onTripSelect: (data: ItineraryData) => void;
  onSectionChange: (section: 'landing' | 'planner' | 'itinerary' | 'history') => void;
}

export function HistorySection({ onTripSelect, onSectionChange }: HistorySectionProps) {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTripsHistory();
        setTrips(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el historial');
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleSelectTrip = async (tripId: number) => {
    try {
      setIsLoadingTrip(true);
      setSelectedTripId(tripId);
      const tripData = await getTripById(tripId);
      onTripSelect(tripData);
      onSectionChange('itinerary');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el viaje');
      setSelectedTripId(null);
    } finally {
      setIsLoadingTrip(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysCount = (start: string, end: string) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial de viajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Viajes</h1>
          <p className="text-gray-600">Accede a tus planes de viajes guardados</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {trips.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">Aún no tienes viajes guardados</p>
            <button
              onClick={() => onSectionChange('planner')}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Crear tu primer viaje
            </button>
          </div>
        )}

        {/* Trips Grid */}
        {trips.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {trips.map(trip => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer"
                onClick={() => handleSelectTrip(trip.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    {trip.destino}
                  </h3>
                  {selectedTripId === trip.id && isLoadingTrip && (
                    <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">
                      {trip.fecha_inicio} a {trip.fecha_fin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">
                      {getDaysCount(trip.fecha_inicio, trip.fecha_fin)} días
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Creado: {formatDate(trip.fecha_creacion)}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTrip(trip.id);
                  }}
                  disabled={isLoadingTrip && selectedTripId === trip.id}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {isLoadingTrip && selectedTripId === trip.id ? 'Cargando...' : 'Ver Itinerario'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex gap-4 justify-center">
          <button
            onClick={() => onSectionChange('planner')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Planificar Nuevo Viaje
          </button>
          <button
            onClick={() => onSectionChange('landing')}
            className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-lg transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
