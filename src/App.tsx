import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Applications from "./pages/Applications/Applications";
import "./App.css";
import type { ReactNode } from "react";
import Header from "./components/Header";
import Assistant from "./pages/Assistant/Assistant";
import ApplicationDetail from "./pages/ApplicationDetail/ApplicationDetail";

const PrivateRoute = ({ children }: any) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className="px-6 py-4 h-screen pt-20">{children}</main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/verify-email"
            element={
              <div className="p-8 text-center">
                Verify Email Page Placeholder
              </div>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <Layout>
                  <Applications />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/application/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ApplicationDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <PrivateRoute>
                <Layout>
                  <Assistant />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
