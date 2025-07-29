import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { JSX } from 'react';


const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user?.isAuthenticated || user?.role.name !== "Admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAdmin;
