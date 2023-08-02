import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Button from "../smallElts/Button/Button";
import mc from "./login.module.scss";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmail,
  getPassword,
  postLogin,
} from "../../Redux/Reducers/login.slice";
import Modale from "../smallElts/Modale/Modale";

const Login = () => {
  const { password, email } = useSelector((store) => store.login);
  const dispatch = useDispatch();
  const [alertElt, setAlertElt] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/";
  }

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleEmail = (e) => {
    dispatch(getEmail(e));
  };
  const handlePassword = (e) => {
    dispatch(getPassword(e));
  };
  async function handleSubmit(e) {
    e.preventDefault();
    let body = { email, password };
    try {
      const response = await dispatch(postLogin({ body }));
      if (response.type === "users/login/fulfilled") {
        setAlertElt(response.payload.result.message);
        localStorage.setItem("token", response.payload.result.token);
        return response;
      } else {
        setAlertElt(<h2>{response.error.message}</h2>);
        toggleModal();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return (
    <>
      <>
        {isOpen ? (
          <Modale message={alertElt} setModaleOpen={toggleModal} />
        ) : null}
      </>
      <Header />
      <main>
        <section className={`${mc.formSection}`}>
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
                  handleEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="password">Entre ton mot de passe : </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  handlePassword(e.target.value);
                }}
              />
            </div>
            <Button message={"Je me connecte"} />
          </form>

          <NavLink to={"/signup"}>
            <h2>Je ne suis pas encore membre, je m'inscris!</h2>
          </NavLink>
        </section>
      </main>
    </>
  );
};

export default Login;
