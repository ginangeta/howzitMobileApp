// src/context/LoginContext.js
import React, { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'customer' or 'celebrity'
  const [walletBalance, setWalletBalance] = useState(5.0); // default mock balance
  const [userData, setUserData] = useState(null); // for profile info, if needed
  const [isLoggedIn, setIsLoggedIn] = useState(null); // whether user is logged in

  const login = (userType) => {
    setIsLoggedIn(true);
    setUserType(userType);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserData(null);
  };

  return (
    <LoginContext.Provider
      value={{
        userType,
        setUserType,
        walletBalance,
        setWalletBalance,
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout, // optional logout method
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
