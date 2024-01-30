import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface TokenContextProps {
  children: ReactNode;
}

interface TokenContextValue {
    token: string | null;
    username: string | null;
    setToken: (token: string | null, username: string | null) => void;
  }

const TokenContext = createContext<TokenContextValue | undefined>(undefined);

const TokenProvider: React.FC<TokenContextProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(()=> localStorage.getItem('token') || null);
  const [username, setUsername] = useState<string | null>(()=> localStorage.getItem('username') || null);

  useEffect(() => {
    localStorage.setItem('token', token || '');
    localStorage.setItem('username', username || '');
  }, [token, username]);

  const setTokenAndUsername = (newToken: string | null, newUsername: string | null) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  return (
    <TokenContext.Provider value={{ token, username, setToken: setTokenAndUsername }}>
      {children}
    </TokenContext.Provider>
  );
};

const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export { TokenProvider, useToken };