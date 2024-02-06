import ChangePassword from "../../pages/Auth/ChangePassword";
import ForgotPassword from "../../pages/Auth/ForgotPassword";
import Login from "../../pages/Auth/Login";

export const authRoutes = [
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/change-password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/forgot-password",
    element: <ChangePassword />,
  },
  // {
  //   path: "/auth/change-password",
  //   element: <ChangePassword />,
  // },
];
