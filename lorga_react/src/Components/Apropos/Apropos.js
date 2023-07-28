import React from "react";
import Header from "../Header/Header";
import will from "../../public/medias/will.png";
import yula from "../../public/medias/yula.png";
import fruckie from "../../public/medias/clubJesus.png";
import lanar from "../../public/medias/laptopCatLogo2.png";
import mc from "./apropos.module.scss";
import { NavLink } from "react-router-dom";

const Apropos = () => {
  const token = window.localStorage.getItem("token");

  return (
    <>
      <Header />
      {!token ? (
        <main>
          <section>
            <h2>Notre équipe</h2>
            <article className={`${mc.lafamille}`}>
              <div className={`${mc.blocText}`}>
                <h3>Will</h3>
                <p>Le patron bien aimé</p>
              </div>
              <img src={will} alt="photo de Will" />
            </article>
            <article className={`${mc.lafamille}`}>
              <img src={yula} alt="photo de Yula" />
              <div className={`${mc.blocText}`}>
                <h3>Yula</h3>
                <p>Votre bartender préférée / Communicante</p>
              </div>
            </article>
            <article className={`${mc.lafamille}`}>
              <div className={`${mc.blocText}`}>
                <h3>Fruckie</h3>
                <p>Notre Directeur artistique</p>
              </div>
              <img src={fruckie} alt="Photo de Fruckie" />
            </article>
            <article className={`${mc.lafamille}`}>
              <img src={lanar} alt="" />
              <div className={`${mc.blocText}`}>
                <h3>Lanar</h3>
                <p>Votre second bartender préféré / dévellopeur web</p>
              </div>
            </article>
          </section>
        </main>
      ) : (
        <main>
          <section className={`${mc.sectionEquipe}`}>
            <h2>Notre équipe</h2>
            <article className={`${mc.lafamille}`}>
              <div className={`${mc.blocText}`}>
                <h3>Will</h3>
                <p>Le patron bien aimé</p>
              </div>
              <img src={will} alt="photo de Will" />
            </article>
            <article className={`${mc.lafamille}`}>
              <img src={yula} alt="photo de Yula" />
              <div className={`${mc.blocText}`}>
                <h3>Yula</h3>
                <p>Votre bartender préférée / Communicante</p>
              </div>
            </article>
            <article className={`${mc.lafamille}`}>
              <div className={`${mc.blocText}`}>
                <h3>Fruckie</h3>
                <p>Notre Directeur artistique</p>
              </div>
              <img src={fruckie} alt="Photo de Fruckie" />
            </article>
            <article className={`${mc.lafamille}`}>
              <img src={lanar} alt="" />
              <div className={`${mc.blocText}`}>
                <h3>Lanar</h3>
                <p>Votre second bartender préféré / dévellopeur web</p>
              </div>
            </article>
          </section>
          <section>
            <h2>S'impliquer dans la vie de Lorga!</h2>
            <p>
              Pour créer une page artiste c'est{" "}
              <NavLink to={"/nouvelartiste"}>par ici</NavLink>
            </p>
            <p>
              Pour créer une page collectif et réserver un créneau c'est par là!
            </p>
          </section>
        </main>
      )}
    </>
  );
};

export default Apropos;
