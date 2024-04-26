import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import NotFound from "./pages/user-page/NotFound";
import { useAuth } from "./states/auth";
import HomePage from "./pages/user-page/home/HomePage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
      <Route
          index
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {isAuthenticated ? (
          <Route path="/" element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
