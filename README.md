# Apply Tracker Frontend

A modern, professional dashboard for managing job applications and generating application materials using AI. Built with React 19, Vite 8, and Tailwind CSS 4.

## 🚀 Key Features

- **Applications Dashboard**: View and track all your job applications in one place.
- **Smart Reminders**: Automatic 7-day follow-up reminders for pending applications.
- **AI Assistant**: Generate professional CVs and cover letters tailored to specific job descriptions using LLMs.
- **Detailed View**: Manage specific application details, notes, and status updates.
- **Secure Auth**: Full authentication flow including login and registration.
- **Design Driven**: Integrated with Figma design tokens for a polished UI.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript 6](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown) for AI responses.

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components (Button, Input, Header, etc.)
├── context/        # React Contexts (Auth, etc.)
├── lib/            # Utility functions and shared libraries
├── pages/          # Full page components (Dashboard, Login, Assistant, etc.)
├── services/       # API service layers
├── types/          # TypeScript interfaces and types
└── test/           # Test suites and configuration
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory based on the following template (see `.env.example` if available):
   ```env
   VITE_API_URL=http://localhost:3000
   FIGMA_TOKEN=your_figma_token
   FIGMA_FILE_KEY=your_figma_file_key
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## 🧪 Testing

Run unit and integration tests:
```bash
npm test
```

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.
- `npm test`: Runs the Vitest test runner.
- `npm run fetch-figma`: Helper script to fetch design tokens from Figma.

---

Built with ❤️ by the Apply Tracker Team.
