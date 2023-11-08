import React, { useEffect, useState } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/reducers/user.slice";
import { NavLink } from "react-router-dom";
import Button from "../smallElts/button/button";
import { updatePassword } from "../../redux/reducers/login.slice";

const PageUser = () => {
  const [changeMdp, setChangeMdp] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationNewPw, setConfirmationNewPw] = useState("");
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const updateMdp = async (e) => {
    e.preventDefault();
    if (user && confirmationNewPw === newPassword) {
      const id = parseInt(user.userId);
      const body = { oldPassword, newPassword, id };
      const response = await dispatch(updatePassword({ body, token }));
      console.log(response);
      let { status } = response.payload;
      if (status === 200) {
        const { message } = response.payload;
      }
      if (status >= 400) {
        let { message } = response.payload.error;
      }
    }
  };
  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Mes informations : </h2>
          <article>
            <h3>{user.username}</h3>
            {user.artisteId ? (
              <p>
                <NavLink
                  to={`/artistes/${encodeURIComponent(user.artisteName)}`}
                >
                  Ma page {user.artisteName}
                </NavLink>
              </p>
            ) : null}
            {user.collectifs.length > 0 ? (
              <ul>
                {user.collectifs.map((collectif) => {
                  return (
                    <li>
                      <NavLink
                        to={`/collectifs/${encodeURIComponent(collectif.nom)}`}
                      >
                        {collectif.nom}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {changeMdp ? (
              <form
                action=""
                onSubmit={(e) => {
                  updateMdp(e);
                }}
              >
                <div>
                  <label htmlFor="">ancien mot de passe : </label>
                  <input
                    type="password"
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="">nouveau mot de passe : </label>
                  <input
                    type="password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="">confirme le nouveau mot de passe : </label>
                  <input
                    type="password"
                    onChange={(e) => {
                      setConfirmationNewPw(e.target.value);
                    }}
                  />
                </div>
                <Button message={`Valider`} />
                <Button
                  message={`Annuler`}
                  onClick={(e) => {
                    setChangeMdp(false);
                  }}
                />
              </form>
            ) : (
              <Button
                message={`Changer mon mot de passe`}
                onClick={(e) => {
                  setChangeMdp(true);
                }}
              />
            )}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PageUser;
