import React, { useEffect, useState } from "react";
import logo from "../../public/medias/lorgaLogo.jpg";
import logo2 from "../../public/medias/lorgaLogo2.jpg";
import mc from "./header.module.scss";
// import photoPda from "../../public/medias/photoPda.jpg";
import { NavLink } from "react-router-dom";
import { manageDisplayDate } from "../../Helpers/dates";
import { getUser } from "../../Helpers/usersHelper";
const Header = () => {
  // const [opacity, setOpacity] = useState(1);
  const [displayDate, setDisplayDate] = useState("");
  const [user, setUser] = useState({});
  const [userName, setUserName] = useState("");
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    setDisplayDate(manageDisplayDate());
  }, []);
  useEffect(() => {
    getUser(token)
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [token]);
  return (
    <header>
      <section className={`${mc.blocLogo}`}>
        <div>
          <ul>
            <li>
              <NavLink>Accueil/Programmation</NavLink>
            </li>
            <li>
              <NavLink>Carte des boissons</NavLink>
            </li>
            <li>
              <NavLink>À propos de nous</NavLink>
            </li>
            <li>
              <NavLink>Galerie</NavLink>
            </li>
          </ul>
        </div>
        <img src={logo2} alt="Logo de Lorga" />
        <div>
          {" "}
          <p>{displayDate}</p>
          {!token ? (
            <p>
              <NavLink to={"/login"}>Inscription/connexion</NavLink>
            </p>
          ) : (
            <>
              <p>Bienvenue</p>
              <p>{user.username}</p>
            </>
          )}
        </div>
      </section>
    </header>
  );
};

export default Header;
