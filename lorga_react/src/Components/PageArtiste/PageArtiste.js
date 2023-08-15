import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getArtisteByName } from "../../Redux/Reducers/createArtiste.slice";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
import Modale from "../smallElts/Modale/Modale";
import { fetchUser } from "../../Redux/Reducers/user.slice";
import Button from "../smallElts/Button/Button";

const PageArtiste = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { nom } = useParams();
  const [artiste, setArtiste] = useState([]);
  const [message, setMessage] = useState(null);
  const { imageData, loading, error } = useSelector((state) => state.upload);
  const { loadingUser, errorUser } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [img, setImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [artisteName, setArtisteName] = useState(null);

  console.log(user);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getArtiste = async () => {
      try {
        let response = await dispatch(getArtisteByName({ nom, token }));
        let status = response.payload.status;
        if (status <= 201) {
          setArtiste(await response.payload.data);
        }
        if (status >= 400 || error) {
          let { message } = response.payload;
          setMessage(message);
          toggleModal();
        }
      } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
      }
    };
    getArtiste();
  }, [dispatch, nom, token]);
  useEffect(() => {
    if (artiste) {
      const displayUpload = async () => {
        let photoId = artiste.photoId;
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
      displayUpload();
    }
  }, [dispatch, artiste, token]);
  useEffect(() => {
    dispatch(fetchUser(token));
    // setArtisteName(user.artisteName ? user.artisteName : null);
  }, [dispatch, token]);

  return (
    <>
      <>
        {isOpen ? (
          <Modale
            message={message}
            setModaleOpen={(e) => {
              toggleModal(e);
            }}
          />
        ) : null}
      </>
      <Header />
      <main>
        {loading || loadingUser ? (
          <h2>Données en chargement</h2>
        ) : error || errorUser ? (
          <p>{error}</p>
        ) : artisteName || artisteName === nom ? (
          <>
            <section>
              <div>
                <img src={img} alt={artiste.description} />
              </div>
              <article>
                <h2
                  onClick={(e) => {
                    handleModale(e);
                  }}
                >
                  {artiste.nom}
                </h2>
                <p>{artiste.style}</p>
                <p>{artiste.description}</p>
                <p>{artiste.influences}</p>
              </article>
            </section>
            <Button message={`Changer mes données`} onClick={toggleModal} />
          </>
        ) : artiste && img ? (
          <section>
            <div>
              <img src={img} alt={artiste.description} />
            </div>
            <article>
              <h2>{artiste.nom}</h2>
              <p>{artiste.style}</p>
              <p>{artiste.description}</p>
              <p>{artiste.influences}</p>
            </article>
          </section>
        ) : (
          <h2>Quelque chose cloche...</h2>
        )}
      </main>
    </>
  );
};

export default PageArtiste;
