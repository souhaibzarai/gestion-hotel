export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}