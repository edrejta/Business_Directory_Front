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