import React, { createContext, useState, useEffect } from "react";
import config from "./config";

export const IdentityContext = createContext<any>("");

export const logout = () => {

  window.location.href = `${config.domainUrl}/logout?client_id=${config.clientId}&logout_uri=${config.logoutUri}`;
  sessionStorage.clear()
};



export const IdentityProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const queryParams = window.location.search;
  const code = queryParams.substring(6);

  useEffect(() => {
    const stored_token = sessionStorage.getItem("access_token");
    if (stored_token !== undefined && stored_token !== null) {
      fetchUserDetails(stored_token);
    }
    else {
        fetchTokens()
    }
  }, []);

  function fetchTokens() {
    const authData = btoa(`${config.clientId}:${config.clientSecret}`);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authData}`,
      },
    };
    fetch(
      `${config.domainUrl}/oauth2/token?grant_type=${config.grant_type}&code=${code}&client_id=${config.clientId}&redirect_uri=${config.loginRedirectUri}`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.access_token !== undefined)
            sessionStorage.setItem("access_token", data.access_token);
        if (data.access_token !== undefined)
            fetchUserDetails(data.access_token);
      });
  }

  function fetchUserDetails(accessToken: string) {    
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    fetch(`${config.domainUrl}/oauth2/userInfo`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (!!data.username) {
          setUser(data);
        } else {
          setUser(null);
        }
      });
  }

  return (
    <IdentityContext.Provider value={{
      user,
      userToken: sessionStorage.getItem("access_token")
    }}>{children}</IdentityContext.Provider>
  );
};
