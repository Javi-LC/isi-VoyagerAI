/**
 * Utilidad para mapear nombre de icono (string) a componente Lucide.
 * Lucide React no exporta un lookup dinámico, así que usamos un mapa.
 */
import {
  AlertTriangle, Cpu, Utensils, Camera, MapPin, Coffee, ShoppingBag,
  Music, Palette, Book, TreePine, Waves, Train, Bus, Plane, Ship,
  Bed, Sun, CloudRain, Umbrella, Thermometer, Wind, Compass, Globe,
  Heart, Star, Building, Church, Castle, LandmarkIcon, Theater,
  CreditCard, Info, Lightbulb, Shield, Clock, Map, Navigation,
  Bike, Car, Ticket, Gem, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "alert-triangle": AlertTriangle,
  "alerttriangle": AlertTriangle,
  cpu: Cpu,
  utensils: Utensils,
  camera: Camera,
  "map-pin": MapPin,
  "mappin": MapPin,
  coffee: Coffee,
  "shopping-bag": ShoppingBag,
  "shoppingbag": ShoppingBag,
  music: Music,
  palette: Palette,
  book: Book,
  "tree-pine": TreePine,
  "treepine": TreePine,
  waves: Waves,
  train: Train,
  bus: Bus,
  plane: Plane,
  ship: Ship,
  bed: Bed,
  sun: Sun,
  "cloud-rain": CloudRain,
  "cloudrain": CloudRain,
  umbrella: Umbrella,
  thermometer: Thermometer,
  wind: Wind,
  compass: Compass,
  globe: Globe,
  heart: Heart,
  star: Star,
  building: Building,
  church: Church,
  castle: Castle,
  landmark: LandmarkIcon,
  theater: Theater,
  "credit-card": CreditCard,
  "creditcard": CreditCard,
  info: Info,
  lightbulb: Lightbulb,
  shield: Shield,
  clock: Clock,
  map: Map,
  navigation: Navigation,
  bike: Bike,
  car: Car,
  ticket: Ticket,
  gem: Gem,
  museum: LandmarkIcon,
};

export function getIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase().trim();
  return iconMap[normalized] || MapPin;
}
