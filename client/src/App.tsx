import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Navbar } from "./components/layout/Navbar";
import { SocketProvider } from "./context/SocketContext";
import { ChatMainWorkspace } from "./components/chat/ChatMainWorkspace";
import { ModalProvider } from "./context/ModalContext";

// Protected Layout wrapper injecting real-time socket listeners
function ProtectedLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SocketProvider>
      <ModalProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden">
          {/* Top Navbar */}
          <Navbar />

          {/* Main interactive chat panels */}
          <div className="flex-1 flex overflow-hidden">
            <Outlet />
          </div>
        </div>
      </ModalProvider>
    </SocketProvider>
  );
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Main Real-time authenticated interface entrypoint */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<ChatMainWorkspace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
