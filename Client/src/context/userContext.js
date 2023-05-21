import { createContext, useEffect, useState } from 'react';
import { useCrxFetch } from '../hooks/useCrxFetch';
import appConfig from '../config/appConfig';
import { useLocation } from 'react-router-dom';

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const location = useLocation();
  console.log(location);
  const crxFetch = useCrxFetch();
  const [user, setUser] = useState({});

  const getInfo = () => {
    crxFetch.get(appConfig.profile).then((res) => {
      setUser(res.data.data.user);
    });
  };

  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      getInfo();
    }
  }, []);

  return (
    <>
      {(location.pathname === '/login' || location.pathname === '/register') && (
        <UserContext.Provider
          value={{
            user,
            setUser,
          }}
        >
          {children}
        </UserContext.Provider>
      )}

      {location.pathname !== '/login' && location.pathname !== '/register' && user.id && (
        <UserContext.Provider
          value={{
            user,
            setUser,
          }}
        >
          {children}
        </UserContext.Provider>
      )}
    </>
  );
};

export { UserContext, UserProvider };
