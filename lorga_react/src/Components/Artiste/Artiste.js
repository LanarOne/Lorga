import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { getArtistes } from "../../Redux/Reducers/artistes.slice";
import mc from "./artiste.module.scss";
import { NavLink } from "react-router-dom";
import Modale from "../smallElts/Modale/Modale";

const Artiste = () => {
  const dispatch = useDispatch();
  const { data, loadingArtiste, errorArtiste } = useSelector(
    (state) => state.artistes
  );
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [artistes, setArtistes] = useState([]);
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const displayData = async () => {
      dispatch(await getArtistes());
    };
    displayData();
  }, [dispatch]);
  useEffect(() => {
    setArtistes(data.data);
  });
  return (
    <>
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModal} />
        ) : null}
      </>
      <Header />
      <main>
        <section>
          {loadingArtiste ? (
            <h2>Chargement des données...</h2>
          ) : errorArtiste ? (
            toggleModal()
          ) : artistes ? (
            <>
              {artistes.map((artiste) => {
                return (
                  <article>
                    <h3>
                      <NavLink to={`/artistes/${artiste.nom}`}>
                        {artiste.nom}
                      </NavLink>
                    </h3>
                    <p>{artiste.style}</p>
                  </article>
                );
              })}
            </>
          ) : (
            <h2>Quelque chose cloche...</h2>
          )}
        </section>
      </main>
    </>
  );
};

export default Artiste;
