import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mc from "./pageBoisson.module.scss";
import { getOneBoisson } from "../../Redux/Reducers/boisson.slice";
import Modale from "../smallElts/Modale/Modale";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
import Button from "../smallElts/Button/Button";

const PageBoisson = () => {
  const { boissonid } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user);
  const { loadingBoisson, errorBoisson } = useSelector(
    (state) => state.boisson
  );
  const [boisson, setBoisson] = useState({});
  const [message, setMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [img, setImg] = useState();
  const [adminMode, setAdminMode] = useState(false);

  const toggleModale = () => {
    setIsOpen(!isOpen);
  };
  const toggleAdminMode = () => {
    setAdminMode(true);
  };

  useEffect(() => {
    const getBoisson = async () => {
      let error;
      let status;

      try {
        const id = parseInt(boissonid);
        const response = await dispatch(getOneBoisson({ id, token }));
        error = response.payload.error;
        status = response.payload.status;
        if (status <= 201) {
          setBoisson(response.payload.data);
        }
        if (status >= 400 || error) {
          let { message } = error;
          setMessage(message);
          toggleModale();
        }
      } catch (e) {
        throw new Error(e.message);
      }
    };
    getBoisson();
  }, [user]);
  useEffect(() => {
    const displayUploaded = async () => {
      const photoId = boisson.photoId;
      const photo = await dispatch(getPhoto({ photoId, token }));
      if (
        photo &&
        photo.payload &&
        photo.payload.result &&
        photo.payload.result.data
      ) {
        const tempUrl = await photo.payload.result.data.path
          .replace(/\\/g, "/")
          .replace("uploads", "uploaded");
        const url = `photo/${tempUrl}`;
        const response = await dispatch(getUpload(url));
        setImg(await response.payload.result);
      }
    };
    displayUploaded();
  }, [boisson]);
  return (
    <>
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModale} />
        ) : null}
      </>
      <Header />
      <main>
        <section>
          {loadingBoisson ? (
            <h2>Chargement des données...</h2>
          ) : boisson ? (
            <article>
              <img src={img} alt={boisson.description} />
              <div className={`${mc.blocTexte}`}>
                <h2>{boisson.nom}</h2>
                <h3>{boisson.famille}</h3>
                <p>{boisson.type}</p>
                <p>{boisson.description}</p>
                <p>{boisson.saveurs}</p>
                <p>{boisson.recette}</p>
                {user && boisson && img && user.roleId >= 5 ? (
                  <Button
                    message={`Modifier cette boisson`}
                    onClick={toggleAdminMode}
                  />
                ) : null}
              </div>
            </article>
          ) : boisson && adminMode ? (
            <></>
          ) : (
            <h2>Quelque chose cloche...</h2>
          )}
        </section>
      </main>
    </>
  );
};

export default PageBoisson;
