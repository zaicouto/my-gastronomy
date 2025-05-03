import React from "react";
import { baseUrl } from "../utils/constants.js";

export default function useAuth() {
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
      }

      return data;
    } catch (error) {
      console.error("Error logging in: ", error);
      return;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {};

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
      return;
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
