import React, { useEffect, useState } from "react";
import logo from "../../public/medias/lorgaLogo.jpg";
import logo2 from "../../public/medias/lorgaLogo2.jpg";
import mc from "./header.module.scss";
import { NavLink } from "react-router-dom";
import { manageDisplayDate } from "../../Helpers/dates";
import IcomoonReact from "icomoon-react";
import iconSet from "../../Style/IcoMoon/selection.json";
import Button from "../smallElts/Button/Button";
import { useSelector } from "react-redux";
const Header = () => {
  const [displayDate, setDisplayDate] = useState("");
  const user = useSelector((state) => state.user);
  console.log(user);

  const token = window.localStorage.getItem("token");
  function deconexion() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  useEffect(() => {
    setDisplayDate(manageDisplayDate());
  }, []);
  return (
    <header>
      <section className={`${mc.blocLogo}`}>
        <div>
          <ul>
            <li>
              <NavLink to={"/"}>Accueil/Programmation</NavLink>
            </li>
            <li>
              <NavLink>Carte des boissons</NavLink>
            </li>
            <li>
              <NavLink to={"/apropos"}>L'équipe/Contact</NavLink>
            </li>
            <li>
              <NavLink>Galerie</NavLink>
            </li>
            <li>
              {!user.roleId ? (
                ""
              ) : user.roleId === 1 ? (
                <NavLink>Réserver une table</NavLink>
              ) : user.roleId === 2 ? (
                <NavLink to={`artistes/${user.artisteName}`}>
                  Gérer ma page {user.artisteName}
                </NavLink>
              ) : user.roleId === 3 ? (
                <NavLink>Gérer un collectif</NavLink>
              ) : user.roleId === 4 ? (
                <NavLink>Gérer mon collectif</NavLink>
              ) : (
                <NavLink to={"/admin"}>Admin</NavLink>
              )}
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
