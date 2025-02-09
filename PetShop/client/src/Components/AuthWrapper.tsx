import { useSelector,  } from 'react-redux';
import { RootState } from '../store';


const AuthWrapper = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  
  return (
    <div>
      {user?.isAuthenticated ? (
        <div>
          <h2>Welcome, {user.username}</h2>
        </div>
      ) : (
        <div>
          <h2>Welcome, Anoymous</h2>
        </div>
      )}
    </div>
  );
};

export default AuthWrapper;