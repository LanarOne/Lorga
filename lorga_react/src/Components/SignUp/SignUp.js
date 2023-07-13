import React, { useState } from "react";
import Header from "../Header/Header";
import Button from "../smallElts/Button/Button";
import mc from "./signup.module.scss";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [zipCode, setZipCode] = useState();
  console.log(email, password, confirmation, username, zipCode);
  return (
    <>
      <Header />
      <main>
        <form action="" className={`${mc.signUpForm}`}>
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
