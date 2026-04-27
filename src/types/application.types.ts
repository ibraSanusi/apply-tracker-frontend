export interface Application {
  id: number;
  company: string;
  position: string;
  createdAt: string;
  email?: string;
  salary?: number;
  medium?: string;
  cvUrl?: string;
  coverUrl?: string;
  cvPdfUrl?: string;
}

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
  data: Application;
}

export interface GetApplicationsResponse {
  data: Application[];
}
