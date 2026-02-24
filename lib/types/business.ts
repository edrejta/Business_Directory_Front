export type BusinessStatus = "Pending" | "Approved" | "Rejected";

export type Business = {
  id: string;
  name: string;
  city: string;
  type: string;
  description?: string | null;

 
  businessNumber?: string | null;
  businessUrl?: string | null;

  status: BusinessStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBusinessInput = {
  name: string;
  city: string;
  type: string;
  description?: string;

 
  businessNumber: string; 
  businessUrl?: string;   
};

export type UpdateBusinessInput = {
  name?: string;
  city?: string;
  type?: string;
  description?: string;

 
  businessUrl?: string;

};