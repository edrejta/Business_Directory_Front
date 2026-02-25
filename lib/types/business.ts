export type BusinessStatus = "Pending" | "Approved" | "Rejected" | string;

export type Business = {
  id: string;
  ownerId: string;

  name: string;
  type: string;

  city: string;
  address?: string | null;

  businessUrl?: string | null;
  description?: string | null;

  phoneNumber?: string | null;
  imageUrl?: string | null;

  businessNumber: string;

  status: BusinessStatus;
  createdAt: string;

  suspensionReason?: string | null;
  isFavorite?: boolean;
};

export type CreateBusinessInput = {
  name: string;
  type: string;
  city: string;

  address?: string;
  businessUrl?: string;
  description?: string;

  phoneNumber?: string;
  imageUrl?: string;

  businessNumber: string;
};

export type UpdateBusinessInput = CreateBusinessInput;