import React, { useState } from "react";
import Header from "../Header/Header";
import Button from "../smallElts/Button/Button";
import mc from "./signup.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getConfirmation,
  getDOB,
  getEmail,
  getPassword,
  getUsername,
  getZipCode,
  postSignup,
} from "../../Redux/Reducers/signup.slice";
import Modale from "../smallElts/Modale/Modale";

const SignUp = () => {
  const { email, password, confirmation, username, zipCode, DOB } = useSelector(
    (store) => store.signup
  );
  const [isOpen, setIsOpen] = useState(false);
  const [alertElt, setAlertElt] = useState(null);
  const dispatch = useDispatch();
  const toggleModale = () => {
    setIsOpen(!isOpen);
  };
  const handleEmail = (e) => {
    dispatch(getEmail(e));
  };
  const handlePassword = (e) => {
    dispatch(getPassword(e));
  };
  const handleConfirmation = (e) => {
    dispatch(getConfirmation(e));
  };
  const handleUsername = (e) => {
    dispatch(getUsername(e));
  };
  const handleZipCode = (e) => {
    dispatch(getZipCode(e));
  };
  const handleDOB = (e) => {
    dispatch(getDOB(e));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmation) {
      setAlertElt(<h2>Le mot de passe ne correspond pas à la confirmation</h2>);
      toggleModale();
    }
    if (password === confirmation) {
      try {
        const body = { email, password, username, zipCode, DOB };
        const response = await dispatch(postSignup({ body }));
        const { status, message } = response.payload;
        if (status <= 201) {
          localStorage.setItem("token", response.payload.result.token);
          window.location.href = "/";
        }
        if (status >= 400) {
          setAlertElt(<h2>{message}</h2>);
          toggleModale();
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  return (
    <>
      <>
        {isOpen ? (
          <Modale message={alertElt} setModaleOpen={toggleModale} />
        ) : null}
      </>
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
                handleEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="username">Ton pseudo : </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                handleUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="password">Ton mot de passe : </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                handlePassword(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="confirmation">Confirme ton mot de passe : </label>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => {
                handleConfirmation(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="zipCode">Ton code postal : </label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => {
                handleZipCode(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="DOB">Ta date de naissance : </label>
            <input
              type="date"
              value={DOB}
              onChange={(e) => {
                handleDOB(e.target.value);
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
