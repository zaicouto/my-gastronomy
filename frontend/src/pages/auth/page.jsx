import React from "react";
import s from "./page.module.css";
import { Button, TextField } from "@mui/material";
import useAuth from "../../hooks/use-auth";

export default function Auth() {
  const [formType, setFormType] = React.useState("login");
  const [formData, setFormData] = React.useState(null);
  const { login, signUp } = useAuth();

  console.log("formType :>> ", formType);
  console.log("formData.email :>> ", formData?.email);

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
        console.log("Logging in with data: ", formData?.email);

        response = await login(formData);
        console.log("response.body.token :>> ", response.body.token);

        break;
      case "signUp":
        console.log("Signing up with data: ", formData?.email);

        if (formData.password !== formData.passwordConfirmation) {
          console.log("Passwords do not match!");
          return;
        }

        response = await signUp(formData);
        console.log("response.body.token :>> ", response.body.token);

        break;
      default:
        console.log("Unknown form type: ", formType);
        break;
    }
  };

  const handleDataChange = (e) => {
    console.log("e.target :>> ", e.target);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
