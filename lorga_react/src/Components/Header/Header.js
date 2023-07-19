import React, { useEffect, useState } from "react";
import logo from "../../public/medias/lorgaLogo.jpg";
import logo2 from "../../public/medias/lorgaLogo2.jpg";
import mc from "./header.module.scss";
// import photoPda from "../../public/medias/photoPda.jpg";
import { NavLink } from "react-router-dom";
import { manageDisplayDate } from "../../Helpers/dates";
import { getUser } from "../../Helpers/usersHelper";
import IcomoonReact, { iconList } from "icomoon-react";
import iconSet from "../../Style/IcoMoon/selection.json";
import Button from "../smallElts/Button/Button";
const Header = () => {
  const [displayDate, setDisplayDate] = useState("");
  const [user, setUser] = useState({});
  const token = window.localStorage.getItem("token");

  function deconexion() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  useEffect(() => {
    setDisplayDate(manageDisplayDate());
  }, []);
  useEffect(() => {
    if (token) {
      getUser(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          return new Error(error.message);
        });
    }
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
              <Button
                message={
                  <IcomoonReact
                    icon={"switch"}
                    iconSet={iconSet}
                    color={"Crimson"}
                    size={20}
                    onClick={deconexion}
                  />
                }
              />
            </>
          )}
        </div>
      </section>
    </header>
  );
};

export default Header;
