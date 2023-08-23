import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mc from "./collectif.module.scss";
import { getCollectifs } from "../../Redux/Reducers/collectifs.slice";
import Header from "../Header/Header";
import Modale from "../smallElts/Modale/Modale";
import { NavLink } from "react-router-dom";

const Collectif = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { data, loading, error } = useSelector((state) => state.collectifs);
  const [collectifs, setCollectifs] = useState([]);
  const token = localStorage.getItem("token");
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const getConfirmedCollectifs = async () => {
      const confirmedCollectifs = await dispatch(getCollectifs());
      setCollectifs(confirmedCollectifs.payload.data);
    };
    getConfirmedCollectifs();
  }, [dispatch]);
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
          {loading ? (
            <h2>Chargement des données...</h2>
          ) : error ? (
            setIsOpen(true)
          ) : collectifs ? (
            <>
              {collectifs.map((collectif) => {
                return (
                  <article key={collectif.id}>
                    <h3>
                      <NavLink to={`/collectifs/${collectif.nom}`}>
                        {collectif.nom}
                      </NavLink>
                    </h3>
                    <p>{collectif.style}</p>
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

export default Collectif;
