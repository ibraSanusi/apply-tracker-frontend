const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ChatRequest {
  jobDescription: string;
  cvTemplate: string;
}

export const assistantService = {
  chat: ({ jobDescription, cvTemplate }: ChatRequest): Promise<any> =>
    fetch(`${API_URL}/applications/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ jobDescription, cvTemplate }),
    }),
};
