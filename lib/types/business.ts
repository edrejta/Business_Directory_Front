export type BusinessStatus = "Pending" | "Approved" | "Rejected" | "Suspended" | string;

export interface Business {
  id: string;
  name: string;
  city?: string;
  businessType?: string;
  status?: BusinessStatus;
  description?: string;
  ownerId?: string;
}

export interface CreateBusinessInput {
  name: string;
  city?: string;
  businessType?: string;
  description?: string;
}

export interface UpdateBusinessInput {
  name?: string;
  city?: string;
  businessType?: string;
  description?: string;
}
