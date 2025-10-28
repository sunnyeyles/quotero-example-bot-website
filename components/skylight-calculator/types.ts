export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LocationDetails {
  suburb: string;
  postcode: string;
}

export interface InstallationType {
  type: "roof-only" | "complete";
}

export interface RoofDetails {
  type: "tile" | "metal" | "other";
  pitch: "flat" | "pitched" | "steep";
}

export interface SkylightDetails {
  type: "fixed" | "electric" | "manual" | "solar";
  size: string;
}

export interface AdditionalSkylight {
  id: string;
  type: "fixed" | "electric" | "manual" | "solar";
  size: string;
}

export interface PropertyDetails {
  storeys: "single" | "double";
  inspectionAvailability: "weekdays" | "weekends" | "flexible";
}

export interface StepNotes {
  [key: string]: string;
}

export interface QuoteFormData {
  personalDetails: PersonalDetails;
  locationDetails: LocationDetails;
  installationType: InstallationType;
  roofDetails: RoofDetails;
  skylightDetails: SkylightDetails;
  additionalSkylights: AdditionalSkylight[];
  propertyDetails: PropertyDetails;
  images: File[];
  notes: StepNotes;
}

export interface QuoteCalculation {
  baseInstallation: number;
  roofTypeAdjustment: number;
  roofPitchAdjustment: number;
  skylightTypeCost: number;
  additionalSkylightsCost: number;
  storeysAdjustment: number;
  premiumSuburbAdjustment: number;
  subtotal: number;
  gst: number;
  total: number;
}

export const SUBURBS = [
  { name: "Bondi", postcode: "2026" },
  { name: "Maroubra", postcode: "2035" },
  { name: "Coogee", postcode: "2034" },
  { name: "Randwick", postcode: "2031" },
  { name: "Kensington", postcode: "2033" },
  { name: "Kingsford", postcode: "2032" },
  { name: "Mascot", postcode: "2020" },
  { name: "Botany", postcode: "2019" },
  { name: "Eastlakes", postcode: "2018" },
  { name: "Pagewood", postcode: "2035" },
  { name: "Rosebery", postcode: "2018" },
  { name: "Waterloo", postcode: "2017" },
  { name: "Alexandria", postcode: "2015" },
  { name: "Zetland", postcode: "2017" },
  { name: "Redfern", postcode: "2016" },
  { name: "Surry Hills", postcode: "2010" },
  { name: "Paddington", postcode: "2021" },
  { name: "Woollahra", postcode: "2025" },
  { name: "Double Bay", postcode: "2028" },
  { name: "Rose Bay", postcode: "2029" },
  { name: "Vaucluse", postcode: "2030" },
  { name: "Dover Heights", postcode: "2030" },
  { name: "Bronte", postcode: "2024" },
  { name: "Waverley", postcode: "2024" },
  { name: "Bellevue Hill", postcode: "2023" },
];

export const SKYLIGHT_SIZES = [
  "460x870",
  "665x665",
  "665x870",
  "665x970",
  "665x1270",
  "665x1885",
  "870x870",
  "870x1275",
  "870x1505",
  "870x1935",
  "970x970",
  "970x1275",
  "1275x1275",
  "1275x1935",
];

export const PREMIUM_SUBURBS = [
  "Bondi",
  "Coogee",
  "Paddington",
  "Woollahra",
  "Double Bay",
  "Rose Bay",
  "Vaucluse",
  "Dover Heights",
  "Bronte",
  "Waverley",
  "Bellevue Hill",
];
