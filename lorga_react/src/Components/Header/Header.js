import React, { useEffect, useState } from "react";
import logo from "../../public/medias/lorgaLogo.jpg";
import logo2 from "../../public/medias/lorgaLogo2.jpg";
import mc from "./header.module.scss";
import { NavLink } from "react-router-dom";
import { manageDisplayDate } from "../../Helpers/dates";
import IcomoonReact from "icomoon-react";
import iconSet from "../../Style/IcoMoon/selection.json";
import Button from "../smallElts/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../Redux/Reducers/user.slice";
import { getCollectifByCreateur } from "../../Redux/Reducers/createCollectif.slice";
const Header = () => {
  const [displayDate, setDisplayDate] = useState("");
  const user = useSelector((state) => state.user);
  const [collectif, setCollectif] = useState([]);
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");
  function deconexion() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
  useEffect(() => {
    setDisplayDate(manageDisplayDate());
  }, []);
  useEffect(() => {
    dispatch(fetchUser({ token }));
  }, [token]);
  useEffect(() => {
    const getDatas = async () => {
      let userId = user.userId;
      if (!userId) {
        return;
      }
      let error;
      let status;
      if (user.collectifs.length > 0) {
        let collectif = await dispatch(
          getCollectifByCreateur({ userId, token })
        );
        status = collectif.payload.status;
        error = collectif.payload.message;
        if (status >= 400) {
          if (status === 404) {
            console.log(error);
            return;
          }
          console.error(error);
        }
        setCollectif(collectif.payload.result.data);
      }
    };
    if (user) {
      getDatas();
    }
  }, [user]);
  return (
    <>
      <header>
        <section className={`${mc.blocLogo}`}>
          <div>
            <ul>
              <li>
                <NavLink to={"/"}>Accueil/Programmation</NavLink>
              </li>
              <li>
                <NavLink to={"/carte"}>Carte des boissons</NavLink>
              </li>
              <li>
                <NavLink to={"/apropos"}>L'équipe/Contact</NavLink>
              </li>
              <li>
                <NavLink>Galerie</NavLink>
              </li>

              {!user.roleId ? (
                ""
              ) : user.roleId === 1 ? (
                <li>
                  <NavLink to={"/booking"}>Réserver une table</NavLink>
                </li>
              ) : user.roleId === 2 ? (
                <li>
                  <NavLink to={`/artistes/${user.artisteName}`}>
                    Gérer ma page {user.artisteName}
                  </NavLink>
                </li>
              ) : user.roleId === 3 ? (
                <>
                  <li>
                    <NavLink>Gérer le collectif {collectif.nom}</NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/artistes/${encodeURIComponent(user.artisteName)}`}
                    >
                      Gérer ma page {user.artisteName}
                    </NavLink>
                  </li>
                </>
              ) : user.roleId <= 5 ? (
                <NavLink
                  to={`/collectifs/${encodeURIComponent(collectif.nom)}`}
                >
                  Gérer mon collectif {collectif.nom}
                </NavLink>
              ) : user.roleId >= 6 ? (
                <NavLink to={"/admin"}>Admin</NavLink>
              ) : null}
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
    </>
  );
};

export default Header;
