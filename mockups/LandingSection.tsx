import React from 'react';
import { Zap, Shield, RefreshCw } from 'lucide-react';
import { ActiveSection } from './types';

interface LandingSectionProps {
  onSectionChange: (section: ActiveSection) => void;
}

export function LandingSection({ onSectionChange }: LandingSectionProps) {
  return (
    <div>
      <section className="px-6 py-20 text-center text-white bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="mx-auto my-0 max-w-[900px]">
          <h2 className="mb-6 text-6xl font-extrabold leading-tight max-sm:text-4xl">
            AI-Powered Travel Planning
          </h2>
          <p className="mb-10 text-2xl leading-relaxed opacity-95 max-sm:text-lg">
            Smart itineraries that adapt to weather, local events, and your
            personal preferences in real-time
          </p>
          <button
            className="px-12 py-5 text-lg font-semibold text-indigo-500 rounded-xl transition-all cursor-pointer bg-white border-none duration-300 ease-out shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.2)] hover:transform hover:scale-105"
            onClick={() => onSectionChange('planner')}
          >
            Start Planning Free
          </button>
        </div>
      </section>
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto my-0 max-w-[1200px]">
          <h3 className="mb-16 text-4xl font-bold text-center text-zinc-900">
            Why Voyager AI?
          </h3>
          <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            <article className="p-8 bg-gray-50/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out hover:shadow-lg hover:transform hover:scale-105">
              <div className="mb-5 text-3xl bg-indigo-500 rounded-xl h-[60px] w-[60px] flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900">
                Save Time
              </h4>
              <p className="m-0 text-base leading-relaxed text-stone-500">
                Condense hours of research into seconds. No more switching
                between weather apps, maps, and news sites.
              </p>
            </article>
            <article className="p-8 bg-gray-50/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out hover:shadow-lg hover:transform hover:scale-105">
              <div className="mb-5 text-3xl bg-indigo-500 rounded-xl h-[60px] w-[60px] flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900">
                Stay Safe
              </h4>
              <p className="m-0 text-base leading-relaxed text-stone-500">
                Real-time alerts about local incidents, weather warnings,
                and events that could affect your trip.
              </p>
            </article>
            <article className="p-8 bg-gray-50/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out hover:shadow-lg hover:transform hover:scale-105">
              <div className="mb-5 text-3xl bg-indigo-500 rounded-xl h-[60px] w-[60px] flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900">
                Smart Adaptation
              </h4>
              <p className="m-0 text-base leading-relaxed text-stone-500">
                AI automatically adjusts your itinerary when weather changes
                or unexpected events occur.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
