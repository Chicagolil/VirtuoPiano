export interface User {
  id: string;
  userName: string;
  level: number;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  userName: string;
  level: number;
  createdAt: string; // Pour la sérialisation JSON
}
