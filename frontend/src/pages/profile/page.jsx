import React from "react";
import s from "./page.module.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../../hooks/use-auth";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const authToken = localStorage.getItem("auth-token");

  React.useEffect(() => {
    if (!authToken) {
      console.log("No auth token found, redirecting to auth page...");
      navigate("/auth");
    }
  }, [authToken, navigate]);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Perfil</h1>
      <div className={s.profileContainer}>
        <h2>Boas-vindas, {user?.email}</h2>
        <Button
          onClick={() => {
            logout();
            navigate("/auth");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
