import React, { useState } from "react";
import Header from "../Header/Header";
import Button from "../smallElts/Button/Button";
import mc from "./signup.module.scss";
import { getRequest, postRequest } from "../../api/api";
import { SIGNUP } from "../../constants/constants";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [zipCode, setZipCode] = useState(33000);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmation) {
      alert(`Le mot de passe ne correspond pas à la confirmation`);
    }
    if (password === confirmation) {
      try {
        const body = { email, password, username, zipCode };
        const response = await postRequest(SIGNUP, body);
        const { error, status, result } = response;
        if (status === 201) {
          const data = result;
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        } else {
          return error.message;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  return (
    <>
      <Header />
      <main>
        <form
          action=""
          className={`${mc.signUpForm}`}
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div>
            <label htmlFor="email">Ton e-mail : </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="username">Ton pseudo : </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="password">Ton mot de passe : </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="confirmation">Confirme ton mot de passe : </label>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="zipCode">Ton code postal : </label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
              }}
            />
          </div>
          <Button message={"Je valide"} />
        </form>
      </main>
    </>
  );
};

export default SignUp;
