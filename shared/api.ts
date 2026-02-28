/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface MedicationEntry {
  id: number;
  name: string;
  morning: boolean;
  midday: boolean;
  evening: boolean;
  intervalHours: number;
  durationDays: number;
  doseValue: number;
  unit: string;
}

export interface DoseSchedule {
  id: number;
  medicationId: number;
  medicationName: string;
  dose: number;
  unit: string;
  time: string;
  day: number;
  type: 'matin' | 'midi' | 'soir';
  statusReminderSent: boolean;
  statusTaken: boolean;
}

export type AccountType = "standard" | "professional" | "pharmacist";

export interface UserDTO {
  id: number;
  email: string | null;
  phone: string | null;
  type: AccountType;
  name: string;
}

export interface DashboardStats {
  observanceRate: number;
  activeReminders: number;
  plannedReminders: number;
  nearbyPharmacies: number;
  nextDose: DoseSchedule | null;
}
