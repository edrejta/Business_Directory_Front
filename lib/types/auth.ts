export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role: 0 | 1; // User | BusinessOwner; Admin (2) nuk lejohet në signup
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: number;
}
