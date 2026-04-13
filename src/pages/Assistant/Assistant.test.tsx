import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Assistant from "./Assistant";
import { assistantService } from "../../services/assistant.service";
import { useAuth } from "../../context/AuthContext";

// Mock the service and context
vi.mock("../../services/assistant.service", () => ({
  assistantService: {
    chat: vi.fn(),
  },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Assistant Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
