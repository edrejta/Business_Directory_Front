export type Business = {
  Id: string;
  OwnerId: string;
  BusinessName: string;
  Address: string;
  City: string;
  Email: string;
  PhoneNumber: string;
  BusinessType: number;
  Description: string;
  ImageUrl: string;
  Status: string;
  CreatedAt: string;
};

export type CreateBusinessInput = {
  BusinessName: string;
  Address: string;
  City: string;
  Email: string;
  PhoneNumber: string;
  BusinessType: number;
  Description: string;
  ImageUrl: string;
};

export type UpdateBusinessInput = CreateBusinessInput;