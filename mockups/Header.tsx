"use client";
import React from 'react';
import { ActiveSection } from './types';

interface HeaderProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  return (
    <header className="sticky top-0 px-0 py-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] z-[1000]">
      <div className="flex justify-between items-center px-6 py-0 mx-auto my-0 max-w-[1200px]">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 text-xl rounded-xl font-bold text-white bg-indigo-500 flex items-center justify-center">
            V
          </div>
          <h1 className="m-0 text-2xl font-bold bg-clip-text">Voyager AI</h1>
        </div>
        <nav className="flex gap-8 max-sm:hidden">
          <button
            className="px-0 py-2 text-base transition-all cursor-pointer border-none duration-300 ease-out bg-transparent"
            onClick={() => onSectionChange('landing')}
            style={{
              fontWeight: activeSection === 'landing' ? '600' : '400',
              color: activeSection === 'landing' ? '#667eea' : '#333',
            }}
          >
            Home
          </button>
          <button
            className="px-0 py-2 text-base transition-all cursor-pointer border-none duration-300 ease-out bg-transparent"
            onClick={() => onSectionChange('planner')}
            style={{
              fontWeight: activeSection === 'planner' ? '600' : '400',
              color: activeSection === 'planner' ? '#667eea' : '#333',
            }}
          >
            Plan Trip
          </button>
          <button
            className="px-0 py-2 text-base transition-all cursor-pointer border-none duration-300 ease-out bg-transparent"
            onClick={() => onSectionChange('itinerary')}
            style={{
              fontWeight: activeSection === 'itinerary' ? '600' : '400',
              color: activeSection === 'itinerary' ? '#667eea' : '#333',
            }}
          >
            My Trips
          </button>
        </nav>
      </div>
    </header>
  );
}
