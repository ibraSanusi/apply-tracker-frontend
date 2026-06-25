import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Assistant from "./Assistant";
import { assistantService } from "../../services/assistant.service";
import { applicationService } from "../../services/application.service";
import { useAuth } from "../../context/AuthContext";

const mockNavigate = vi.fn();

// Mock the service and context
vi.mock("../../services/assistant.service", () => ({
  assistantService: {
    chat: vi.fn(),
  },
}));

vi.mock("../../services/application.service", () => ({
  applicationService: {
    save: vi.fn(),
  },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Assistant Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    (useAuth as any).mockReturnValue({
      user: { name: "Ibra" },
    });
  });

  it("renders welcome message when no messages are present", () => {
    render(<Assistant />);
    expect(screen.getByText(/¡Hola, Ibra!/i)).toBeInTheDocument();
  });

  it("updates job description state on textarea change", () => {
    render(<Assistant />);
    const textarea = screen.getByPlaceholderText(/Pega aquí la descripción del empleo/i);
    fireEvent.change(textarea, { target: { value: "Software Engineer position" } });
    expect(textarea).toHaveValue("Software Engineer position");
  });

  it("adds user message and calls chat service when sending", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("AI response chunk"));
        controller.close();
      },
    });

    (assistantService.chat as any).mockResolvedValue({
      body: mockStream,
    });

    render(<Assistant />);
    const textarea = screen.getByPlaceholderText(/Pega aquí la descripción del empleo/i);
    const sendButton = screen.getByRole("button");

    fireEvent.change(textarea, { target: { value: "Job offer" } });
    fireEvent.click(sendButton);

    // Should show user message
    expect(screen.getByText("Job offer")).toBeInTheDocument();
    
    // Should call service
    expect(assistantService.chat).toHaveBeenCalledWith({
      jobDescription: "Job offer",
      cvTemplate: expect.any(String),
    });

    // Should eventually show assistant response
    await waitFor(() => {
      expect(screen.getByText(/AI response chunk/i)).toBeInTheDocument();
    });
  });

  it("sends message on Enter key press", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
    (assistantService.chat as any).mockResolvedValue({ body: mockStream });

    render(<Assistant />);
    const textarea = screen.getByPlaceholderText(/Pega aquí la descripción del empleo/i);

    fireEvent.change(textarea, { target: { value: "Job offer" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(assistantService.chat).toHaveBeenCalled();
    });
  });

  it("does not send message on Shift+Enter", () => {
    render(<Assistant />);
    const textarea = screen.getByPlaceholderText(/Pega aquí la descripción del empleo/i);

    fireEvent.change(textarea, { target: { value: "Job offer" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: true });

    expect(assistantService.chat).not.toHaveBeenCalled();
  });

  it("shows success toast and navigates when application is saved", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({
              company: "Google",
              position: "Software Engineer",
              cv: {},
              cover: "Hello"
            })
          )
        );
        controller.close();
      },
    });

    (assistantService.chat as any).mockResolvedValue({ body: mockStream });
    (applicationService.save as any).mockResolvedValue({
      data: { id: 123 }
    });

    render(<Assistant />);
    
    // Trigger chat to get a response
    const textarea = screen.getByPlaceholderText(/Pega aquí la descripción del empleo/i);
    fireEvent.change(textarea, { target: { value: "Job offer" } });
    fireEvent.click(screen.getByRole("button"));

    // Wait for the response and the save toast to be visible
    await waitFor(() => {
      expect(screen.getByText(/Sí, guardar/i)).toBeInTheDocument();
    });

    // Click "Sí, guardar"
    fireEvent.click(screen.getByText(/Sí, guardar/i));

    // Wait for applicationService.save to be called and SaveSuccessToast to be visible
    await waitFor(() => {
      expect(applicationService.save).toHaveBeenCalled();
      expect(screen.getByText(/¡Guardado con éxito!/i)).toBeInTheDocument();
    });

    // Click "Ver detalles"
    fireEvent.click(screen.getByText(/Ver detalles/i));

    // Verify navigation was called with the correct ID
    expect(mockNavigate).toHaveBeenCalledWith("/application/123");
  });
});
