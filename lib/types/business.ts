export type BusinessStatus = "Pending" | "Approved" | "Rejected";

export type OwnerBusiness = {
  id: string;
  ownerId?: string;
  businessName: string;
  address: string;
  city: string;
  email: string;
  phoneNumber: string;
  businessType: number;
  description: string;
  imageUrl: string;
  status: BusinessStatus;
  createdAt?: string;
};

export type UpsertBusinessInput = {
  businessName: string;
  address?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  businessType?: number;
  description?: string;
  imageUrl?: string;
};