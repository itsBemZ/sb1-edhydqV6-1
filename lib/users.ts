import { hash } from "bcryptjs";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

// In a real app, this would be stored in a database
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    // Hashed version of "password123"
    password: "$2a$12$k8Y1LJ7GRz7acuYqK3O9/.ZXHT2nFGYq0SYPXKxvVb/44VGS77GSi",
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    // Hashed version of "password123"
    password: "$2a$12$k8Y1LJ7GRz7acuYqK3O9/.ZXHT2nFGYq0SYPXKxvVb/44VGS77GSi",
    role: "user",
  },
];

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}