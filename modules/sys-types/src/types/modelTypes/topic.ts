import type { User } from "./user";

export interface Topic {
  id?: string;
  createById?: number | string;
  createBy: User;
  content: string;
  createdAt: string;
}
