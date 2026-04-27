// Top world cities prioritized by tourism and population
export const POPULAR_CITIES = [
  // Spain
  { name: 'Madrid', country: 'Spain', population: 3223000 },
  { name: 'Barcelona', country: 'Spain', population: 1620000 },
  { name: 'Valencia', country: 'Spain', population: 1605000 },
  { name: 'Seville', country: 'Spain', population: 1528000 },
  { name: 'Zaragoza', country: 'Spain', population: 681000 },
  { name: 'Málaga', country: 'Spain', population: 580000 },
  { name: 'Bilbao', country: 'Spain', population: 345000 },
  { name: 'Alicante', country: 'Spain', population: 330000 },
  { name: 'Córdoba', country: 'Spain', population: 325000 },
  { name: 'Valladolid', country: 'Spain', population: 298000 },
  { name: 'Toledo', country: 'Spain', population: 84000 },
  { name: 'Granada', country: 'Spain', population: 232000 },
  { name: 'Salamanca', country: 'Spain', population: 152000 },
  { name: 'San Sebastián', country: 'Spain', population: 186000 },
  { name: 'Palma', country: 'Spain', population: 399000 },
  { name: 'Murcia', country: 'Spain', population: 404000 },
  { name: 'Ibiza', country: 'Spain', population: 49000 },
  { name: 'Tarragona', country: 'Spain', population: 134000 },
  { name: 'Oviedo', country: 'Spain', population: 225000 },
  
  // Europe
  { name: 'Paris', country: 'France', population: 2161000 },
  { name: 'London', country: 'United Kingdom', population: 8937000 },
  { name: 'Berlin', country: 'Germany', population: 3645000 },
  { name: 'Rome', country: 'Italy', population: 2762000 },
  { name: 'Amsterdam', country: 'Netherlands', population: 873000 },
  { name: 'Vienna', country: 'Austria', population: 1920000 },
  { name: 'Prague', country: 'Czech Republic', population: 1320000 },
  { name: 'Budapest', country: 'Hungary', population: 1752000 },
  { name: 'Warsaw', country: 'Poland', population: 1863000 },
  { name: 'Milan', country: 'Italy', population: 1352000 },
  { name: 'Venice', country: 'Italy', population: 258000 },
  { name: 'Florence', country: 'Italy', population: 382000 },
  { name: 'Barcelona', country: 'Spain', population: 1620000 },
  { name: 'Lisbon', country: 'Portugal', population: 548000 },
  { name: 'Athens', country: 'Greece', population: 3154000 },
  { name: 'Istanbul', country: 'Turkey', population: 15840000 },
  { name: 'Copenhagen', country: 'Denmark', population: 1350000 },
  { name: 'Stockholm', country: 'Sweden', population: 975000 },
  { name: 'Brussels', country: 'Belgium', population: 1220000 },
  { name: 'Zurich', country: 'Switzerland', population: 402000 },
  { name: 'Geneva', country: 'Switzerland', population: 201000 },
  
  // Americas
  { name: 'New York', country: 'United States', population: 8398000 },
  { name: 'Los Angeles', country: 'United States', population: 3990000 },
  { name: 'Chicago', country: 'United States', population: 2716000 },
  { name: 'Miami', country: 'United States', population: 467000 },
  { name: 'Las Vegas', country: 'United States', population: 644000 },
  { name: 'San Francisco', country: 'United States', population: 873000 },
  { name: 'Washington DC', country: 'United States', population: 689000 },
  { name: 'Boston', country: 'United States', population: 692000 },
  { name: 'Toronto', country: 'Canada', population: 2930000 },
  { name: 'Vancouver', country: 'Canada', population: 631000 },
  { name: 'Mexico City', country: 'Mexico', population: 21581000 },
  { name: 'Cancún', country: 'Mexico', population: 889000 },
  { name: 'Buenos Aires', country: 'Argentina', population: 2890000 },
  { name: 'Rio de Janeiro', country: 'Brazil', population: 6748000 },
  { name: 'São Paulo', country: 'Brazil', population: 12252000 },
  { name: 'Lima', country: 'Peru', population: 10012000 },
  { name: 'Bogotá', country: 'Colombia', population: 8181000 },
  { name: 'Cartagena', country: 'Colombia', population: 876000 },
  
  // Asia
  { name: 'Tokyo', country: 'Japan', population: 37400000 },
  { name: 'Bangkok', country: 'Thailand', population: 10156000 },
  { name: 'Singapore', country: 'Singapore', population: 5850000 },
  { name: 'Hong Kong', country: 'Hong Kong', population: 7496000 },
  { name: 'Shanghai', country: 'China', population: 27793000 },
  { name: 'Beijing', country: 'China', population: 21535000 },
  { name: 'New Delhi', country: 'India', population: 32941000 },
  { name: 'Mumbai', country: 'India', population: 20812000 },
  { name: 'Seoul', country: 'South Korea', population: 9776000 },
  { name: 'Phuket', country: 'Thailand', population: 410000 },
  { name: 'Bali', country: 'Indonesia', population: 4100000 },
  { name: 'Kuala Lumpur', country: 'Malaysia', population: 1982000 },
  { name: 'Hanoi', country: 'Vietnam', population: 8156000 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', population: 9040000 },
  { name: 'Manila', country: 'Philippines', population: 11855000 },
  { name: 'Jakarta', country: 'Indonesia', population: 10562000 },
  { name: 'Dubai', country: 'United Arab Emirates', population: 3612000 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', population: 1450000 },
  { name: 'Tel Aviv', country: 'Israel', population: 460000 },
  { name: 'Jerusalem', country: 'Israel', population: 874000 },
  
  // Africa
  { name: 'Cairo', country: 'Egypt', population: 20076000 },
  { name: 'Giza', country: 'Egypt', population: 4272000 },
  { name: 'Cape Town', country: 'South Africa', population: 3740000 },
  { name: 'Johannesburg', country: 'South Africa', population: 5635000 },
  { name: 'Lagos', country: 'Nigeria', population: 15388000 },
  { name: 'Marrakech', country: 'Morocco', population: 928000 },
  { name: 'Casablanca', country: 'Morocco', population: 3359000 },
  { name: 'Nairobi', country: 'Kenya', population: 4397000 },
  { name: 'Accra', country: 'Ghana', population: 4010000 },
  
  // Oceania
  { name: 'Sydney', country: 'Australia', population: 5367000 },
  { name: 'Melbourne', country: 'Australia', population: 5159000 },
  { name: 'Auckland', country: 'New Zealand', population: 1618000 },
  { name: 'Brisbane', country: 'Australia', population: 2509000 },
];

// Simple fuzzy search algorithm
export function calculateSimilarity(search: string, target: string): number {
  const s = search.toLowerCase();
  const t = target.toLowerCase();
  
  // Exact match
  if (t === s) return 100;
  
  // Starts with (highest priority after exact)
  if (t.startsWith(s)) return 90;
  
  // Contains as substring
  if (t.includes(s)) return 70;
  
  // Levenshtein-like distance (simplified)
  let matches = 0;
  for (let i = 0; i < Math.min(s.length, t.length); i++) {
    if (s[i] === t[i]) matches++;
  }
  
  return (matches / Math.max(s.length, t.length)) * 50;
}

export interface CitySearchResult {
  name: string;
  country: string;
  displayName: string;
  population: number;
  score: number;
}

export function searchCities(query: string, limit: number = 5): CitySearchResult[] {
  if (query.length < 2) return [];

  const results = POPULAR_CITIES
    .map(city => ({
      ...city,
      displayName: `${city.name}, ${city.country}`,
      score: calculateSimilarity(query, city.name),
    }))
    .filter(result => result.score > 20) // Filter low scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results as CitySearchResult[];
}
