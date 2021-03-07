import { Link } from "gatsby";
import React, { useContext } from "react";
import { Flex, NavLink, Button } from "theme-ui";
import config from "../utilities/config";
import logo from "../images/icon.png";
import { IdentityContext, logout } from "../utilities/identity-context";

export const Navbar = () => {
  // const logout = () => {
  //   console.log("LOGOUTTT");

  //   window.location.href = `${config.domainUrl}/logout?client_id=${config.clientId}&logout_uri=${config.logoutUri}`;
  //   sessionStorage.removeItem("access_token");
  // };

  const userData = useContext(IdentityContext);

  return (
    <Flex as="nav">
      <NavLink as={Link} to="/" p={2}>
        <img src={logo} alt="logo" width="50px" />
      </NavLink>
      <div style={{ margin: "auto 0 auto auto" }}>
        <NavLink
          as={Link}
          to="/"
          p={2}
          sx={{ padding: "8px", margin: "auto 0" }}
        >
          Home
        </NavLink>
        <NavLink
          as={Link}
          to="/todo"
          p={2}
          sx={{ padding: "8px", margin: "auto 0" }}
        >
          Dashboard
        </NavLink>
        <NavLink
          as={Button}
          p={2}
          sx={{ padding: "8px", backgroundColor: "transparent" }}
          onClick={() => {
            !userData
              ? (window.location.href = `${config.domainUrl}/login?client_id=${config.clientId}&response_type=code&scope=email+openid&redirect_uri=${config.loginRedirectUri}`)
              : logout();
          }}
        >
          {userData ? "Logout" : "Login/Signup"}
        </NavLink>
      </div>
    </Flex>
  );
};
