import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDescription,
  getInfluences,
  getNom,
  getPhotoId,
  getStyle,
  getUserId,
  postNewArtiste,
} from "../../Redux/Reducers/createArtiste.slice";
import Button from "../smallElts/Button/Button";
import mc from "./creationArtiste.module.scss";
import { getUser } from "../../Helpers/usersHelper";
import Header from "../Header/Header";

const CreationArtiste = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { nom, description, influences, style, photoId, userId } = useSelector(
    (store) => store.artiste
  );
  const [user, setUser] = useState([]);

  const handleNom = (e) => {
    dispatch(getNom(e));
  };
  const handleDescr = (e) => {
    dispatch(getDescription(e));
  };
  const handleInfluences = (e) => {
    dispatch(getInfluences(e));
  };
  const handleStyle = (e) => {
    dispatch(getStyle(e));
  };
  const handlePhotoId = (e) => {
    dispatch(getPhotoId(e));
  };
  const handleSubmit = async (e) => {
    const userId = user.id;
    e.preventDefault();
    let body = { nom, description, influences, style, photoId, userId };
    console.log(body);
    try {
      const response = await dispatch(postNewArtiste({ body, token }));
      console.log(response);
    } catch (e) {
      throw new Error(e.message);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const datas = await getUser(token);
        setUser(datas);
      }
    };
    const handleUserId = (user) => {
      dispatch(getUserId(user.id));
      return user.id;
    };
    fetchUser().then(handleUserId(user));
  }, [user.length]);
  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Tes informations</h2>
          <p>
            Toutes les informations que tu partages ici seront publiées telles
            quelles dans ta page artiste et éventuellement en page d'accueil si
            tu joues chez nous! Elles seront bien sûr modifiables avant
            publication et nous nous réservons le droit d'ajuster (corriger les
            fautes)
          </p>
        </section>
        <section className={`${mc.formSection}`}>
          <form
            action=""
            className={`${mc.artisteForm}`}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="nom">Ton nom de scène : </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => {
                  handleNom(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="descr">
                Ta description telle qu'elle apparaîtra sur ta page artiste :{" "}
              </label>
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="10"
                value={description}
                onChange={(e) => {
                  handleDescr(e.target.value);
                }}
              ></textarea>
            </div>
            <div>
              <label htmlFor="influences">Tes influences musicale : </label>
              <input
                type="text"
                value={influences}
                onChange={(e) => {
                  handleInfluences(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="style">
                Quel(s) style(s) préfère tu jouer :{" "}
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => {
                  handleStyle(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="photoid">PhotoId</label>
              <input
                type="number"
                value={photoId}
                onChange={(e) => {
                  handlePhotoId(e.target.value);
                }}
              />
            </div>
            <Button message={"Envoyer la Demande"} />
          </form>
        </section>
      </main>
    </>
  );
};

export default CreationArtiste;
