import { z } from 'zod';

// Validation schemas
export const SearchRequestSchema = z.object({
  from: z.string().min(1, 'From station is required'),
  to: z.string().min(1, 'To station is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  class: z.string().optional(),
});

export const BookingRequestSchema = z.object({
  trainNumber: z.string().min(1, 'Train number is required'),
  from: z.string().min(1, 'From station is required'),
  to: z.string().min(1, 'To station is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  class: z.string().min(1, 'Class is required'),
  passengers: z.array(z.object({
    name: z.string().min(1, 'Passenger name is required'),
    age: z.number().min(1).max(120, 'Age must be between 1 and 120'),
    gender: z.enum(['M', 'F', 'T']),
  })).min(1, 'At least one passenger is required'),
});

export const PNRRequestSchema = z.object({
  pnr: z.string().regex(/^\d{10}$/, 'PNR must be 10 digits'),
});

export const TrainStatusRequestSchema = z.object({
  trainNumber: z.string().min(1, 'Train number is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const WaitlistRequestSchema = z.object({
  trainNumber: z.string().min(1, 'Train number is required'),
  from: z.string().min(1, 'From station is required'),
  to: z.string().min(1, 'To station is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  class: z.string().min(1, 'Class is required'),
  waitlistPosition: z.number().min(1, 'Waitlist position must be positive'),
});

// Type definitions
export type SearchRequest = z.infer<typeof SearchRequestSchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;
export type PNRRequest = z.infer<typeof PNRRequestSchema>;
export type TrainStatusRequest = z.infer<typeof TrainStatusRequestSchema>;
export type WaitlistRequest = z.infer<typeof WaitlistRequestSchema>;

export interface Train {
  number: string;
  name: string;
  depart: string;
  arrive: string;
  from: string;
  to: string;
  duration?: string;
}

export interface WaitlistPrediction {
  probability: number;
  waitTime: number;
  recommendation: string;
  trainNumber: string;
  date: string;
  classType: string;
  waitlistPosition: number;
}

export interface PNRStatus {
  pnr: string;
  status: string;
  message: string;
}

export interface TrainStatus {
  trainNumber: string;
  date: string;
  status: string;
  message: string;
}

export interface BookingResult {
  message: string;
  reference?: string;
}

export interface SearchResult {
  success: boolean;
  trains: Train[];
  searchCriteria: {
    from: string;
    to: string;
    date: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}