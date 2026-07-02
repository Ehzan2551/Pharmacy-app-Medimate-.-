// src/types/models.ts
// Complete type definitions for MediMate

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// MEDICATION TYPES
// ============================================================================

export type MedicationFrequency = 
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'custom'
  | 'as_needed'
  | 'weekly'
  | 'monthly';

export type MedicationForm = 
  | 'tablet'
  | 'capsule'
  | 'liquid'
  | 'injection'
  | 'inhaler'
  | 'patch'
  | 'other';

export interface Medication {
  medId: string;
  userId?: string; // Optional for now (until Firebase)
  
  // Basic Information
  name: string; // e.g., "Metformin"
  genericName?: string;
  dosage: string; // e.g., "500mg"
  form?: MedicationForm;
  color?: string;
  shape?: string;
  
  // Medical Information
  purpose: string; // e.g., "Type 2 diabetes management"
  description?: string;
  sideEffects?: string[];
  contraindications?: string[];
  warnings?: string[];
  
  // Dosing
  frequency: MedicationFrequency; // e.g., "once_daily"
  customFrequency?: {
    daysOfWeek: number[]; // 0-6
    times: string[]; // ["08:00", "20:00"]
  };
  instructions?: string; // e.g., "Take with food"
  
  // Prescription Details
  prescribedBy?: string;
  prescribedDate?: string; // ISO date string or Timestamp
  prescriptionExpiry?: string;
  npi?: string;
  rxNumber?: string;
  
  // Pharmacy
  pharmacy?: {
    name: string;
    phone?: string;
    address?: string;
    npi?: string;
  };
  
  // Refill Tracking
  refillCount: number; // e.g., 30 pills
  dailyDose: number; // e.g., 1 pill per day
  daysSupply?: number; // calculated: refillCount / dailyDose
  lastRefillDate?: string; // ISO date string
  nextRefillDueDate?: string;
  
  refillReminder?: {
    enabled?: boolean;
    daysThreshold?: number;
    lastReminderSentAt?: string;
  };
  
  refillHistory?: Array<{
    date: string;
    count: number;
    pharmacy: string;
    daysSupply: number;
  }>;
  
  // Pill Image (for later)
  pillImageUrl?: string;
  imageUploadedAt?: string;
  
  // Reminders
  reminders?: {
    enabled: boolean;
    timezone?: string;
    times: string[]; // ["08:00", "20:00"]
    lastReminderAt?: string;
  };
  
  // Status
  status?: 'active' | 'archived' | 'completed';
  archivedAt?: string;
  
  // Timestamps
  createdAt?: string; // ISO date string
  updatedAt?: string;
}

export interface MedicationInput {
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  purpose: string;
  refillCount: number;
  dailyDose: number;
  instructions?: string;
  form?: MedicationForm;
  pharmacy?: Medication['pharmacy'];
  reminders?: Medication['reminders'];
}

// ============================================================================
// ADHERENCE & TRACKING
// ============================================================================

export type AdherenceStatus = 'taken' | 'skipped' | 'missed';

export interface AdherenceLog {
  logId: string;
  userId?: string;
  medId: string;
  
  scheduledTime: string; // ISO date string
  actualTime?: string;
  timeLate?: number; // seconds
  
  status: AdherenceStatus;
  reason?: string; // 'forgot', 'side_effects', 'unavailable'
  notes?: string;
  snoozedCount?: number;
  
  verifiedBy?: 'user' | 'caregiver' | 'manual';
  verificationNotes?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderNotification {
  reminderId: string;
  userId?: string;
  medId: string;
  
  scheduledTime: string;
  timezone?: string;
  frequency: MedicationFrequency;
  
  title: string;
  body: string;
  
  status: 'pending' | 'sent' | 'completed' | 'skipped' | 'dismissed';
  sentAt?: string;
  completedAt?: string;
  
  notificationId?: string;
  deepLink?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface RefillHistory {
  refillId: string;
  userId?: string;
  medId: string;
  
  amount: number;
  daysSupply: number;
  pharmacy: string;
  refillDate: string;
  expiryDate: string;
  
  rxNumber?: string;
  prescriptionExpiresAt?: string;
  
  status?: 'pending' | 'completed' | 'rejected';
  costAmount?: number;
  insurance?: string;
  
  createdAt?: string;
}

// ============================================================================
// FORM DATA
// ============================================================================

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  purpose: string;
  refillCount: string; // string from input, convert to number
  dailyDose: string;
  instructions?: string;
  form?: MedicationForm;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

export interface MedicationState {
  list: Medication[];
  selectedMedId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  userId: string | null;
  email?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  loading: boolean;
  loadingMessage?: string;
  toast?: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
}

// ============================================================================
// REDUX ACTIONS
// ============================================================================

export interface MedicationAction {
  type: string;
  payload?: any;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export class MediMateError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MediMateError';
  }
}

export const ErrorCodes = {
  // Validation
  VALIDATION_ERROR: 'validation/error',
  INVALID_INPUT: 'validation/invalid-input',
  REQUIRED_FIELD: 'validation/required-field',
  
  // Medication
  MED_NOT_FOUND: 'medication/not-found',
  MED_INVALID_DATA: 'medication/invalid-data',
  MED_DUPLICATE: 'medication/duplicate',
  
  // General
  UNKNOWN_ERROR: 'error/unknown',
} as const;

// ============================================================================
// VALIDATION SCHEMAS (for react-hook-form + zod)
// ============================================================================

import { z } from 'zod';

export const MedicationFormSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.enum([
    'once_daily',
    'twice_daily',
    'three_times_daily',
    'four_times_daily',
    'custom',
    'as_needed',
    'weekly',
    'monthly',
  ] as const),
  purpose: z.string().min(1, 'Purpose/reason is required'),
  refillCount: z.string().refine(
    (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0,
    'Refill count must be a positive number'
  ),
  dailyDose: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Daily dose must be a positive number'
  ),
  instructions: z.string().optional(),
});

export type MedicationFormSchemaType = z.infer<typeof MedicationFormSchema>;

// ============================================================================
// CONSTANTS
// ============================================================================

export const FREQUENCY_OPTIONS = [
  { value: 'once_daily' as const, label: 'Once daily' },
  { value: 'twice_daily' as const, label: 'Twice daily' },
  { value: 'three_times_daily' as const, label: 'Three times daily' },
  { value: 'four_times_daily' as const, label: 'Four times daily' },
  { value: 'as_needed' as const, label: 'As needed' },
  { value: 'weekly' as const, label: 'Weekly' },
  { value: 'custom' as const, label: 'Custom' },
] as const;

export const FORM_OPTIONS = [
  { value: 'tablet' as const, label: 'Tablet' },
  { value: 'capsule' as const, label: 'Capsule' },
  { value: 'liquid' as const, label: 'Liquid' },
  { value: 'injection' as const, label: 'Injection' },
  { value: 'inhaler' as const, label: 'Inhaler' },
  { value: 'patch' as const, label: 'Patch' },
  { value: 'other' as const, label: 'Other' },
] as const;

// Helper to get frequency label
export const getFrequencyLabel = (frequency: MedicationFrequency): string => {
  const option = FREQUENCY_OPTIONS.find((opt) => opt.value === frequency);
  return option?.label || frequency;
};

// Helper to calculate days supply
export const calculateDaysSupply = (refillCount: number, dailyDose: number): number => {
  if (dailyDose === 0) return 0;
  return Math.floor(refillCount / dailyDose);
};

// Helper to get next refill date
export const getNextRefillDate = (lastRefillDate: string, daysSupply: number): string => {
  const lastRefill = new Date(lastRefillDate);
  const nextRefill = new Date(lastRefill.getTime() + daysSupply * 24 * 60 * 60 * 1000);
  return nextRefill.toISOString().split('T')[0];
};

// Helper to get days until refill
export const getDaysUntilRefill = (nextRefillDate: string): number => {
  const today = new Date();
  const refillDate = new Date(nextRefillDate);
  const diffTime = refillDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};