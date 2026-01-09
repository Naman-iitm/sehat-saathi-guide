export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePic?: string;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
