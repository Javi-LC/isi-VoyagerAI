import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { searchCities, CitySearchResult } from '../lib/cities';

interface CityOption {
  name: string;
  country?: string;
  displayName: string;
}

export function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder = "ej., Barcelona, España",
  label = "Destino"
}: CityAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const fetchCitySuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // First try: Search in local popular cities dataset
      const localResults = searchCities(query, 5);
      
      if (localResults.length > 0) {
        setSuggestions(localResults.map(r => ({
          name: r.name,
          country: r.country,
          displayName: r.displayName
        })));
        setIsOpen(true);
        setSelectedIndex(-1);
        setIsLoading(false);
        return;
      }

      // Fallback: Try Nominatim if no local results
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&format=json&limit=5&featuretype=city`
      );
      
      if (!nominatimResponse.ok) throw new Error('Failed to fetch suggestions');
      
      const nominatimData = await nominatimResponse.json();
      const cities: CityOption[] = nominatimData.slice(0, 5).map((item: any) => ({
        name: item.name,
        country: item.address?.country,
        displayName: item.address?.country 
          ? `${item.name}, ${item.address.country}`
          : item.name
      }));
      
      setSuggestions(cities);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Debounce the API call
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchCitySuggestions(newValue);
    }, 200);
  };

  const handleSelectSuggestion = (suggestion: CityOption) => {
    onChange(suggestion.displayName);
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        suggestionsRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      <label className="block mb-2 text-sm font-semibold text-zinc-800">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
          <MapPin className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          className="p-4 pl-10 w-full text-base rounded-xl border-2 border-solid transition-all border-neutral-200 duration-300 ease-out focus:border-indigo-500 focus:outline-none"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value && suggestions.length > 0 && setIsOpen(true)}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader className="w-4 h-4 text-indigo-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 transition-colors border-b border-neutral-100 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-indigo-50'
                  : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-zinc-900">{suggestion.name}</p>
                  {suggestion.country && (
                    <p className="text-sm text-gray-500">{suggestion.country}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !isLoading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          No se encontraron ciudades
        </div>
      )}
    </div>
  );
}
