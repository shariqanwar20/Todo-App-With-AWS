import { Link } from "gatsby";
import React, { useContext } from "react";
import { Flex, NavLink, Button } from "theme-ui";
import config from "../utilities/config";
import logo from "../images/icon.png";
import { IdentityContext, logout } from "../utilities/identity-context";

export const Navbar = () => {
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
            !userData.userToken
              ? (window.location.href = `${config.domainUrl}/login?client_id=${config.clientId}&response_type=code&scope=email+openid&redirect_uri=${config.loginRedirectUri}`)
              : logout();
          }}
        >
          {userData.userToken ? "Logout" : "Login/Signup"}
        </NavLink>
      </div>
    </Flex>
  );
};
