"use client";
import React from 'react';
import { Bot, DollarSign, Shield, RefreshCw, FileText, Camera, Utensils, Building, Palette, Mountain, Wine, CloudRain, AlertTriangle } from 'lucide-react';
import { Preferences } from '../types/travel';

interface TripPlannerProps {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  preferences: Preferences;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onBudgetChange: (value: 'bajo' | 'medio' | 'alto') => void;
  onDietaryChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
  onGenerateItinerary: () => void;
}

export function TripPlanner({
  origin,
  destination,
  startDate,
  endDate,
  preferences,
  onOriginChange,
  onDestinationChange,
  onStartDateChange,
  onEndDateChange,
  onBudgetChange,
  onDietaryChange,
  onInterestsChange,
  onGenerateItinerary,
}: TripPlannerProps) {
  return (
    <section className="px-6 py-16 min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-sm">
      <div className="p-12 mx-auto my-0 rounded-3xl bg-white/80 backdrop-blur-md max-w-[800px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] max-sm:px-6 max-sm:py-8">
        <h2 className="mb-3 text-4xl font-bold text-zinc-900">
          Plan Your Perfect Trip
        </h2>
        <p className="mb-10 text-base text-stone-500">
          Tell us about your origin, destination and preferences, and our AI will
          create a personalized itinerary
        </p>

        <div className="grid gap-5 mb-8 grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-800">
              Origin
            </label>
            <input
              className="p-4 w-full text-base rounded-xl border-2 border-solid transition-all border-neutral-200 duration-300 ease-out focus:border-indigo-500 focus:outline-none"
              type="text"
              placeholder="e.g., Madrid, Spain"
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-800">
              Destination
            </label>
            <input
              className="p-4 w-full text-base rounded-xl border-2 border-solid transition-all border-neutral-200 duration-300 ease-out focus:border-indigo-500 focus:outline-none"
              type="text"
              placeholder="e.g., Barcelona, Spain"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 mb-8 grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-800">
              Start Date
            </label>
            <input
              className="p-4 w-full text-base rounded-xl border-2 border-solid transition-all border-neutral-200 duration-300 ease-out focus:border-indigo-500 focus:outline-none"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-800">
              End Date
            </label>
            <input
              className="p-4 w-full text-base rounded-xl border-2 border-solid transition-all border-neutral-200 duration-300 ease-out focus:border-indigo-500 focus:outline-none"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-3 text-sm font-semibold text-zinc-800">
            Budget Level
          </label>
          <div className="grid gap-3 grid-cols-[repeat(3,1fr)]">
            <button
              className="p-4 text-base font-medium rounded-xl border-2 border-solid transition-all cursor-pointer duration-300 ease-out flex items-center justify-center gap-2"
              onClick={() => onBudgetChange('bajo')}
              style={{
                borderColor: preferences.presupuesto === 'bajo' ? '#667eea' : '#e0e0e0',
                backgroundColor: preferences.presupuesto === 'bajo' ? '#f0f2ff' : 'white',
              }}
            >
              <DollarSign className="w-5 h-5" />
              Budget
            </button>
            <button
              className="p-4 text-base font-medium rounded-xl border-2 border-solid transition-all cursor-pointer duration-300 ease-out flex items-center justify-center gap-2"
              onClick={() => onBudgetChange('medio')}
              style={{
                borderColor: preferences.presupuesto === 'medio' ? '#667eea' : '#e0e0e0',
                backgroundColor: preferences.presupuesto === 'medio' ? '#f0f2ff' : 'white',
              }}
            >
              <Shield className="w-5 h-5" />
              Moderate
            </button>
            <button
              className="p-4 text-base font-medium rounded-xl border-2 border-solid transition-all cursor-pointer duration-300 ease-out flex items-center justify-center gap-2"
              onClick={() => onBudgetChange('alto')}
              style={{
                borderColor: preferences.presupuesto === 'alto' ? '#667eea' : '#e0e0e0',
                backgroundColor: preferences.presupuesto === 'alto' ? '#f0f2ff' : 'white',
              }}
            >
              <RefreshCw className="w-5 h-5" />
              Luxury
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-3 text-sm font-semibold text-zinc-800">
            What are your interests?
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'tecnología', icon: <Building className="w-4 h-4" /> },
              { name: 'museos', icon: <Palette className="w-4 h-4" /> },
              { name: 'gastronomía', icon: <Utensils className="w-4 h-4" /> },
              { name: 'naturaleza', icon: <Mountain className="w-4 h-4" /> },
              { name: 'fotografía', icon: <Camera className="w-4 h-4" /> },
              { name: 'vino', icon: <Wine className="w-4 h-4" /> },
            ].map(interest => (
              <button
                key={interest.name}
                onClick={() => onInterestsChange(interest.name)}
                className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  preferences.intereses.includes(interest.name)
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                }`}
              >
                {interest.icon}
                {interest.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-semibold text-zinc-800">
            Dietary Restrictions (Optional)
          </label>
          <input
            className="p-4 w-full text-base rounded-xl border-2 border-solid transition-all border-neutral-200 duration-300 ease-out focus:border-indigo-500 focus:outline-none"
            type="text"
            placeholder="e.g., Vegetariano, Sin gluten, Celíaco"
            value={preferences.restricciones.join(', ')}
            onChange={(e) => onDietaryChange(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="p-5 w-full text-lg font-semibold bg-indigo-500 rounded-xl transition-all cursor-pointer border-none duration-300 ease-out text-white hover:bg-indigo-600 hover:transform hover:scale-105"
          onClick={onGenerateItinerary}
        >
          Generate AI Itinerary ✨
        </button>

        <div className="p-6 mt-8 bg-gray-50/80 backdrop-blur-sm rounded-xl">
          <p className="m-0 text-sm leading-relaxed text-stone-500">
            <Bot className="inline w-4 h-4 mr-1" />
            <strong>AI-Powered:</strong> Uses Gemini 2.0 Flash to analyze
            weather forecasts, local news, and events
            <br />
            <CloudRain className="inline w-4 h-4 mr-1" />
            <strong>Weather-Adaptive:</strong> Automatically prioritizes
            indoor activities when rain is forecast
            <br />
            <AlertTriangle className="inline w-4 h-4 mr-1" />
            <strong>Real-Time Alerts:</strong> Get notified about
            strikes, events, or safety concerns
          </p>
        </div>
      </div>
    </section>
  );
}
