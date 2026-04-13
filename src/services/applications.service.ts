import { api } from "./api";

export interface SaveApplicationRequest {
  company: string;
  position: string;
  email?: string;
  salary?: number;
  medium?: string;
  cv: string;
  cover: string;
}

export interface SaveApplicationResponse {
  data: {
    id: number;
    company: string;
    position: string;
    createdAt: string;
    email: string;
    salary: number;
    medium: string;
    cvUrl: string;
    coverUrl: string;
  };
}

export const applicationsService = {
  save: (data: SaveApplicationRequest): Promise<SaveApplicationResponse> =>
    api("/applications/save", {
      body: data,
      method: "POST",
      token: localStorage.getItem("token") || undefined,
    }),
};
