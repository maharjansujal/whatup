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
import { AlertProvider } from "./components/shared/alert/alert-provider";
import { ConfirmProvider } from "./components/shared/confirm/confirm-provider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AlertProvider>
          <AuthProvider>
            <SocketProvider>
              <ChatProvider>
                <ModalProvider>
                  <ConfirmProvider>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<ProtectedPage />} />
                      </Route>
                    </Routes>
                  </ConfirmProvider>
                </ModalProvider>
              </ChatProvider>
            </SocketProvider>
          </AuthProvider>
        </AlertProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
