export type BusinessStatus = 0 | 1 | 2;

export type Business = {
  id: string;
  ownerId?: string;
  name: string;
  city: string;
  type: string;
  address?: string;
  businessUrl?: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  openDays?: string;
  imageUrl?: string;
  businessNumber?: string;
  status?: BusinessStatus | string;
  createdAt?: string;
  suspensionReason?: string;
  isFavorite?: boolean;
};

export type CreateBusinessInput = {
  name: string;
  city: string;
  type: string;
  businessNumber: string;
  address?: string;
  businessUrl?: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  openDays?: string;
  imageUrl?: string;
  businessNumber?: string;
};

export type UpdateBusinessInput = {
  name: string;
  city: string;
  type: string;
  address?: string;
  businessUrl?: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  openDays?: string;
  imageUrl?: string;
  businessNumber?: string;
};

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
