import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { emailConfirmation } from "../../redux/reducers/user.slice";
import Button from "../smallElts/button/button";
import Header from "../header/header";
import mc from "./confirmationEmail.module.scss";

const ConfirmationEmail = () => {
  const dispatch = useDispatch();
  const { confirmationToken } = useParams();
  const handleConfirmation = async (e) => {
    e.preventDefault();
    let error;
    let status;
    try {
      const response = await dispatch(emailConfirmation({ confirmationToken }));
      status = response.payload.status;
      if (status === 200) {
        const { message } = response.payload.result;
        alert(`${message}`);
        setTimeout(() => {
          location.href = "/login";
        }, 1000);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <Header />
      <main>
        <section>
          <Button
            message={"JE CONFIRME MON EMAIL"}
            onClick={(e) => {
              handleConfirmation(e);
            }}
          />
        </section>
      </main>
    </>
  );
};

export default ConfirmationEmail;
