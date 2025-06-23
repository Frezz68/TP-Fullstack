export interface User {
  id: number;
  firstname: string;
  password: string;
  lastname: string;
  email: string;
  address?: string;
  phone?: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}
