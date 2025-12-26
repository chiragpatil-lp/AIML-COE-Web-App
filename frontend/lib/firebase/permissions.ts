import type { UserPermissions } from "@/lib/types/auth.types";

/**
 * Firestore UserPermissions with Timestamp support
 * This interface represents how permissions are stored in Firestore
 */
export interface FirestoreUserPermissions {
  userId: string;
  email: string;
  isAdmin: boolean;
  pillars: {
    pillar1: boolean;
    pillar2: boolean;
    pillar3: boolean;
    pillar4: boolean;
    pillar5: boolean;
    pillar6: boolean;
  };
  createdAt?: { toDate(): Date } | Date;
  updatedAt?: { toDate(): Date } | Date;
}

/**
 * Type guard to validate Firestore user permissions data structure
 * Used by both client and server to ensure data integrity
 * @param data - Unknown data from Firestore
 * @returns True if data matches UserPermissions structure
 */
export function isValidUserPermissions(
  data: unknown,
): data is FirestoreUserPermissions {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  return (
    typeof d.userId === "string" &&
    typeof d.email === "string" &&
    typeof d.isAdmin === "boolean" &&
    typeof d.pillars === "object" &&
    d.pillars !== null &&
    typeof (d.pillars as Record<string, unknown>).pillar1 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar2 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar3 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar4 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar5 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar6 === "boolean"
  );
}

/**
 * Safely converts Firestore Timestamp to Date
 * Handles both Firestore Timestamp objects and regular Date objects
 * @param value - Firestore Timestamp or Date
 * @returns JavaScript Date object
 */
export function toDate(value: unknown): Date {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return (value as { toDate(): Date }).toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date();
}

/**
 * Converts validated Firestore permissions to UserPermissions type
 * Normalizes Firestore Timestamps to JavaScript Dates
 * @param data - Validated Firestore permissions data
 * @returns UserPermissions object ready for use in the application
 */
export function fromFirestore(data: FirestoreUserPermissions): UserPermissions {
  return {
    userId: data.userId,
    email: data.email,
    isAdmin: data.isAdmin,
    pillars: data.pillars,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}
