import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { getArtistes } from "../../Redux/Reducers/artistes.slice";
import mc from "./artiste.module.scss";

const Artiste = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.artistes);
  useEffect(() => {
    dispatch(getArtistes());
  }, [dispatch]);
  let content;
  if (loading === "pending") {
    content = <h2>Loading ...</h2>;
  }
  if (loading === "idle") {
    content = data.map((artiste) => {
      return (
        <article>
          <h3>{artiste.nom}</h3>
          <p>{artiste.style}</p>
          <p>{artiste.description}</p>
          <p>{artiste.influences}</p>
        </article>
      );
    });
  }
  if (error !== null) {
    content = <p>{error}</p>;
  }
  return (
    <>
      <Header />
      <main>{content}</main>
    </>
  );
};

export default Artiste;
