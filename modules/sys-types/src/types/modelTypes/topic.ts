import type { User } from "./user";

export interface Topic {
  id?: string;
  createById?: string;
  createBy: User;
  content: string;
  createdAt: string;
}
