import React, { useState } from "react";
import Header from "../Header/Header";
import { postRequest } from "../../api/api";
import { LOGIN } from "../../constants/constants";
import Button from "../smallElts/Button";
import mc from "./login.module.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    let body = { email, password };
    try {
      const response = await postRequest(LOGIN, body);
      if (response.status <= 201) {
        const data = await response.result;
        const token = data.token;
        window.localStorage.setItem("token", token);
        window.location.href = "/";
      } else if (response.status === 403) {
        return alert(`Tous les champ doivent être remplis`);
      } else if (response.status === 401) {
        return alert(`E-mail ou mot de passe incorrect`);
      } else {
        window.location.href = "/signup";
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return (
    <>
      <Header />
      <main>
        <section>
          <form
            className={`${mc.loginForm}`}
            action=""
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="email">Entre ton e-mail : </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="password">Entre ton mot de passe : </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button message={"Je me connecte"} />
          </form>
        </section>
      </main>
    </>
  );
};

export default Login;
