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
  id: string;
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
  medicationId: string;
  medicationName: string;
  dose: number;
  unit: string;
  time: string;
  day: number;
  type: 'matin' | 'midi' | 'soir';
  statusReminderSent: boolean;
  statusTaken: boolean;
}
