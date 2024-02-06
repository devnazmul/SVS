import { Navigate, Route } from "react-router-dom";

const PrivateRoutes = ({ path, component, permissions, ...rest }) => {
  const user = useSelector((state) => state.user); // Access user data from global state
  const hasPermission = user && permissions;

  if (!hasPermission) {
    return <Navigate to="/login" />; // Redirect to login if not authorized
  }

  return <Route path={path} component={component} {...rest} />;
};
