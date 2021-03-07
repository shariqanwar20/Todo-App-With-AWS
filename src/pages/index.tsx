import React, { useContext } from "react";
import { IdentityContext } from "../utilities/identity-context";
import { Navbar } from "../components/Navbar";
import { Button } from "theme-ui";
import { dark } from "@theme-ui/presets";
import { Link } from "@reach/router";
import config from "../utilities/config";

export default function Home() {
  const userData = useContext(IdentityContext);
  return (
    <div>
      <Navbar />
      <div className="centered">
        <p
          style={{
            textAlign: "center",
            margin: "0 auto",
            fontSize: "50px",
            width: "50%",
          }}
        >
          Organize it all with todoist
        </p>
        {!userData ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Button
              onClick={() => {
                window.location.href = `${config.domainUrl}/login?client_id=${config.clientId}&response_type=code&scope=email+openid&redirect_uri=${config.loginRedirectUri}`
              }}
              sx={{
                padding: "10px 30px",
                backgroundColor: dark.colors.secondary,
              }}
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Button
              as={Link}
              to="todo/"
              sx={{
                padding: "10px 30px",
                backgroundColor: dark.colors.secondary,
              }}
            >
              Go To Dashboard
            </Button>
          </div>
        )}
      </div>
      {console.log(userData)}
    </div>
  );
}
