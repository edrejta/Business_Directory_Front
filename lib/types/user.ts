export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: number;
}

export interface UpdateUserInput {
  username: string;
  email: string;
}
