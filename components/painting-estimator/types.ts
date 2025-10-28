export interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

export interface PaintQuality {
  quality: "good" | "better" | "best";
  pricePerLitre: number;
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
}

export interface QuoteFormData {
  paintingDetails: PaintingDetails;
}

export const PAINT_QUALITIES = [
  { quality: "good" as const, label: "Good Quality", pricePerLitre: 35 },
  { quality: "better" as const, label: "Better Quality", pricePerLitre: 50 },
  { quality: "best" as const, label: "Best Quality", pricePerLitre: 65 },
];

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
