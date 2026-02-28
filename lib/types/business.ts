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

export interface OwnerBusiness {
  id: string;
  ownerId?: string;
  businessName: string;
  address?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  businessType?: number;
  description?: string;
  imageUrl?: string;
  photos?: string[];
  status?: string;
  createdAt?: string;
  openDays?: OpenDays;
}

export interface UpsertBusinessInput {
  businessName: string;
  address?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  businessType?: number;
  description?: string;
  imageUrl?: string;
  photos?: string[];
}

export interface OpenDays {
  mondayOpen: boolean;
  tuesdayOpen: boolean;
  wednesdayOpen: boolean;
  thursdayOpen: boolean;
  fridayOpen: boolean;
  saturdayOpen: boolean;
  sundayOpen: boolean;
}

// optional openDays on owner upsert and owner business
export interface OwnerBusinessWithOpenDays extends OwnerBusiness {
  openDays?: OpenDays;
}
