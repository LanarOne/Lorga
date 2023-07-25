import React from "react";
import Header from "../Header/Header";
import Button from "../smallElts/Button/Button";
import mc from "./signup.module.scss";
import { postRequest } from "../../api/api";
import { SIGNUP } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  getConfirmation,
  getEmail,
  getPassword,
  getUsername,
  getZipCode,
} from "../../Redux/Reducers/signup.slice";

const SignUp = () => {
  const { email, password, confirmation, username, zipCode } = useSelector(
    (store) => store.signup
  );
  const dispatch = useDispatch();
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
          localStorage.setItem("token", result.token);
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
          <Button message={"Je valide"} />
        </form>
      </main>
    </>
  );
};

export default SignUp;
