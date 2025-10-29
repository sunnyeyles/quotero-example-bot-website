export interface ContactDetails {
  clientName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

export interface PaintQuality {
  quality: "good" | "better" | "best";
  pricePerLitre: number;
  isRealTimePrice?: boolean;
  priceSource?: string;
  lastUpdated?: string;
}

export interface PaintingDetails {
  scope: "interior" | "exterior";
  roomType: string;
  dimensions: RoomDimensions;
  paintQuality: PaintQuality;
  numberOfCoats: number;
}

export interface PaintingCalculation {
  wallArea: number;
  ceilingArea: number;
  totalArea: number;
  totalPaintLitres: number;
  totalPaintCost: number;
  ancillaryMaterialsCost: number;
  materialsSubtotal: number;
  totalLabourHours: number;
  totalLabourCost: number;
  labourSubtotal: number;
  grandTotal: number;
  gstAmount: number;
  totalIncludingGst: number;
  priceData?: {
    isRealTime: boolean;
    source: string;
    lastUpdated: string;
    paintProducts?: Array<{
      name: string;
      price: number;
      brand: string;
      category: string;
    }>;
  };
}

export interface QuoteFormData {
  contactDetails: ContactDetails;
  paintingDetails: PaintingDetails;
  images: File[];
}

export const PAINT_QUALITIES = [
  { quality: "good" as const, label: "Good Quality", pricePerLitre: 35 },
  { quality: "better" as const, label: "Better Quality", pricePerLitre: 50 },
  { quality: "best" as const, label: "Best Quality", pricePerLitre: 65 },
];

// Helper function to get category key for paint quality
export function getPaintCategoryKey(
  scope: "interior" | "exterior",
  quality: "good" | "better" | "best"
): string {
  return `${scope}-${quality}`;
}

export const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Study/Office",
  "Hallway",
  "Laundry",
  "Other",
];

// Constants from the specification
export const PAINTING_CONSTANTS = {
  COVERAGE_RATE: 14, // square metres per litre
  LABOUR_RATE: 55, // dollars per hour
  WALL_SPEED: 8, // square metres per hour for walls
  CEILING_SPEED: 10, // square metres per hour for ceilings
  ANCILLARY_MATERIALS: 150, // fixed cost for rollers, brushes, tape, etc.
};
