import { api } from "./api";
import type { 
  SaveApplicationRequest, 
  SaveApplicationResponse, 
  GetApplicationsResponse, 
  Application 
} from "../types/application.types";

export const applicationService = {
  save: (data: SaveApplicationRequest): Promise<SaveApplicationResponse> =>
    api("/applications/save", {
      body: data,
      method: "POST",
      token: localStorage.getItem("token") || undefined,
    }),

  getAll: (): Promise<GetApplicationsResponse> =>
    api("/applications/get-all", {
      method: "GET",
      token: localStorage.getItem("token") || undefined,
    }),

  getById: (id: string | number): Promise<{ data: Application }> =>
    api(`/applications/${id}`, {
      method: "GET",
      token: localStorage.getItem("token") || undefined,
    }),

  update: (
    id: string | number,
    data: Partial<SaveApplicationRequest>,
  ): Promise<SaveApplicationResponse> =>
    api(`/applications/${id}`, {
      method: "PUT",
      body: data,
      token: localStorage.getItem("token") || undefined,
    }),

  delete: (id: string | number): Promise<void> =>
    api(`/applications/${id}`, {
      method: "DELETE",
      token: localStorage.getItem("token") || undefined,
    }),
};
