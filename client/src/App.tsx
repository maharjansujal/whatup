import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedPage } from "./pages/ProtectedPage";
import { ProtectedRoute } from "./components/routing/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ModalProvider } from "./context/ModalContext";
import { SocketProvider } from "./context/SocketContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
          <AuthProvider>
            <ChatProvider>
              <ModalProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<ProtectedPage />} />
                  </Route>
                </Routes>
              </ModalProvider>
            </ChatProvider>
          </AuthProvider>
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
