import type {
  QuoteFormData,
  PaintingCalculation,
} from "@/components/painting-estimator/types";

export type EstimateStatus =
  | "draft"
  | "sent_to_business"
  | "accepted"
  | "updated_sent_to_client"
  | "confirmed_sent_to_client";

export type SerializableQuoteFormData = Omit<QuoteFormData, "images"> & {
  images: Array<{ name: string; size?: number; type?: string }>;
};

export interface EstimateRecord {
  id: string;
  formData: SerializableQuoteFormData;
  calculation: PaintingCalculation;
  businessEmail: string;
  status: EstimateStatus;
  createdAt: string;
  updatedAt: string;
}

// In-memory store (replace with DB in production)
const estimateStore = new Map<string, EstimateRecord>();
const consumedJti = new Set<string>();

export function saveEstimate(record: EstimateRecord) {
  estimateStore.set(record.id, {
    ...record,
    updatedAt: new Date().toISOString(),
  });
}

export function getEstimate(id: string) {
  return estimateStore.get(id) || null;
}

export function updateEstimateStatus(id: string, status: EstimateStatus) {
  const existing = estimateStore.get(id);
  if (!existing) return null;
  const updated: EstimateRecord = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };
  estimateStore.set(id, updated);
  return updated;
}

export function markJtiUsed(jti: string) {
  consumedJti.add(jti);
}

export function isJtiUsed(jti: string) {
  return consumedJti.has(jti);
}
