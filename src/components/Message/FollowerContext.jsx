// FollowerContext.js
import { createContext, useState, useContext, useCallback } from 'react';

const FollowerContext = createContext();

export const FollowerProvider = ({ children }) => {
  const [followersUpdated, setFollowersUpdated] = useState(false);

  const triggerUpdate = useCallback(() => {
    setFollowersUpdated(prev => !prev);
  }, []);

  return (
    <FollowerContext.Provider value={{ followersUpdated, triggerUpdate }}>
      {children}
    </FollowerContext.Provider>
  );
};

export const useFollowerContext = () => useContext(FollowerContext);
