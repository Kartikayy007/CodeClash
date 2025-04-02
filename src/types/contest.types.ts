export interface ContestDetails {
  name: string;
  startTime: {
    date: string;
    time: string;
  };
  endTime: {
    date: string;
    time: string;
  };
  organizationName: string;
  description: string;
  rules: string;
  prizes: string;
  score: string;
}

export type ContestSection = "basic" | "description";
