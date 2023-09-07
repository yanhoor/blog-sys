import { User } from "@/types";

export interface Topic {
  id?: string;
  createById?: number | string;
  createBy: User;
  content: string;
  createdAt: string;
}
