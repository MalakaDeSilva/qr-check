export type RequestStatus = "open" | "released" | "confirmed";

export interface RequestDoc {
  _id?: string;
  id: string;
  registrationNumber: string;
  message?: string;
  notifyEmail?: string;
  status: RequestStatus;
  createdAt: string;
  releasedAt?: string;
  confirmedAt?: string;
}

export interface CreateRequestInput {
  registrationNumber: string;
  message?: string;
  notifyEmail?: string;
}
