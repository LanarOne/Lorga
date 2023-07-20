import React, { useEffect, useState } from "react";
import { getUser } from "../../Helpers/usersHelper";
import Header from "../../Components/Header/Header";
import mc from "./admin.module.scss";
import { DatePicker } from "@gsebdev/react-simple-datepicker";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});

  const clickedDate = (e) => {
    console.log(e);
  };

  useEffect(() => {
    const getUserDatas = async () => {
      try {
        const userDatas = await getUser(token);
        setUser(userDatas);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    if (!token) {
      window.location.href = "/";
    } else {
      getUserDatas();
    }
  }, [token]);
  if (user.roleId <= 4) {
    window.location.href = "/";
  }

  return (
    <div className={`${mc.container}`}>
      <Header />
      <main>
        <div className="blocArticle">
          <section>
            <h2>Gestion artistes & collectifs</h2>
            <article>
              <h3>Artistes</h3>
              <ul>
                <li>Valider les demandes de création de page artiste</li>
                <li>Valider un artiste sur une setlist</li>
                <li>Valider une demande d'ajout sur un collectif</li>
                <li>Créer une page artiste</li>
              </ul>
            </article>
            <article>
              <h3>Collectifs</h3>
              <ul>
                <li>Valider les demandes de création de page collectif</li>
                <li>Valider une demande de booking</li>
                <li>Valider une demande d'ajout d'admin pour le collectif</li>
                <li>Créer une page collectif</li>
                <li>Créer une date pour un collectif</li>
              </ul>
            </article>
          </section>
          <section>
            <h2>Gestion clients</h2>
            <ul>
              <li>Valider une demande de réservation</li>
              <li>Proposer une date à un client</li>
              <li>Annuler une réservation</li>
              <li>Blacklist?</li>
            </ul>
          </section>
        </div>
        <aside>
          <h3>Admin : {user.username}</h3>
          <p>
            {user.roleId === 6
              ? "5upaÄaDm!n"
              : user.roleId === 5
              ? "Admin Lorga"
              : `T'as rien à foutre là è_é`}
          </p>
          <DatePicker
            id="datepicker"
            name={"date"}
            onChange={(e) => {
              clickedDate(e.target.value);
            }}
          />
        </aside>
      </main>
    </div>
  );
};

export default Admin;
