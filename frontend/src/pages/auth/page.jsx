import React from "react";
import s from "./page.module.css";
import { Button, TextField } from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import Loading from "../../components/loading.jsx";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [formType, setFormType] = React.useState("login");
  const [formData, setFormData] = React.useState(null);
  const { login, signUp, loading } = useAuth();
  const navigate = useNavigate();

  console.log("formType :>> ", formType);

  // With structuredClone, we can safely remove sensitive data from the formData object
  // without affecting the original object. This is useful for logging or sending data
  const filteredFormData = structuredClone(formData || {});
  delete filteredFormData?.password;
  delete filteredFormData?.passwordConfirmation;
  console.log("Form data: ", filteredFormData);

  const authToken = localStorage.getItem("auth-token");
  console.log("authToken :>> ", authToken);

  React.useEffect(() => {
    if (authToken) {
      console.log("Auth token found, redirecting to profile page...");
      navigate("/profile");
    }
  }, [authToken, navigate]);

  const handleFormTypeChange = () => {
    if (formType === "login") {
      setFormType("signUp");
    } else {
      setFormType("login");
    }
  };

  const handleSubmit = async (e) => {
    console.log("Submitting form...");
    e.preventDefault();

    let response = null;
    switch (formType) {
      case "login":
        console.log("Logging in with data: ", filteredFormData);
        response = await login(formData);
        break;
      case "signUp":
        console.log("Signing up with data: ", filteredFormData);
        if (formData.password !== formData.passwordConfirmation) {
          console.log("Passwords do not match!");
          return;
        }

        response = await signUp(formData);
        break;
      default:
        console.log("Unknown form type: ", formType);
        break;
    }

    if (response?.error) {
      console.log("Failed to authenticate");
      return;
    }

    console.log("response?.body?.token :>> ", response?.body?.token);
  };

  const handleDataChange = (e) => {
    console.log("e.target :>> ", e.target);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (formType === "login") {
    return (
      <div className={s.container}>
        <h1>Login</h1>
        <button onClick={handleFormTypeChange}>
          Não está registrado ainda? Clique aqui
        </button>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            label="E-mail"
            type="email"
            name="email"
            onChange={handleDataChange}
            value={formData?.email || ""}
          ></TextField>
          <TextField
            required
            type="password"
            name="password"
            label="Senha"
            onChange={handleDataChange}
            value={formData?.password || ""}
          ></TextField>
          <Button type="submit">Login</Button>
        </form>
      </div>
    );
  } else {
    return (
      <div className={s.container}>
        <h1>Registrar</h1>
        <button onClick={handleFormTypeChange}>
          Já tem uma conta? Clique aqui
        </button>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            label="Nome completo"
            type="fullName"
            name="fullName"
            onChange={handleDataChange}
            value={formData?.fullName || ""}
          ></TextField>
          <TextField
            required
            label="E-mail"
            type="email"
            name="email"
            onChange={handleDataChange}
            value={formData?.email || ""}
          ></TextField>
          <TextField
            required
            type="password"
            name="password"
            label="Senha"
            onChange={handleDataChange}
            value={formData?.password || ""}
          ></TextField>
          <TextField
            required
            type="password"
            name="passwordConfirmation"
            label="Confirme a senha"
            onChange={handleDataChange}
            value={formData?.passwordConfirmation || ""}
          ></TextField>
          <Button type="submit">Registrar</Button>
        </form>
      </div>
    );
  }
}
