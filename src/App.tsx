
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Chat from './pages/Chat/Chat';

const PrivateRoute = ({ children }: any) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Placeholder for other routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<div className="p-8 text-center">Verify Email Page Placeholder</div>} />
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
