import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
  authenticationPath: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  authenticationPath
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={authenticationPath}
        replace
        state={{ returnUrl: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;