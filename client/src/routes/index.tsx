import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedPage } from "../pages/ProtectedPage";
import { ProtectedRoute } from "../components/routing/ProtectedRoutes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
