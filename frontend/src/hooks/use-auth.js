import React from "react";
import { baseUrl } from "../utils/constants.js";

export function useAuth() {
  const [loading, setLoading] = React.useState(false);

  const login = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response: ", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.body.token) {
        console.log("Token saved in localStorage");
        localStorage.setItem("auth-token", data.body.token);
        localStorage.setItem("user", JSON.stringify(data.body.user));
      }

      return data;
    } catch (error) {
      console.error("Error logging in: ", error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
  };

  const signUp = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Sign up response: ", data);

      return data;
    } catch (error) {
      console.error("Error signin up: ", error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    signUp,
    loading,
  };
}
