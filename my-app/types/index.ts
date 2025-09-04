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
