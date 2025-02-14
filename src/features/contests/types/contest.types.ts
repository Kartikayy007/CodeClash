import { StaticImageData } from "next/image";

export interface Contest {
  id: string;
  banner: StaticImageData;
  name: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  organizer: string;
  participants: number;
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface ContestResponse {
  success: boolean;
  message: string;
  data?: Contest;
}

export interface ValidateContestCodeResponse {
  success: boolean;
  message: string;
  data?: {
    contestId: string;
  };
}

export interface RegisterContestResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
  };
} 