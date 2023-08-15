import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getArtisteByName } from "../../Redux/Reducers/createArtiste.slice";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
import Modale from "../smallElts/Modale/Modale";
import { fetchUser, setArtisteName } from "../../Redux/Reducers/user.slice";
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
  const [nouveauNom, setNouveauNom] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStyle, setNewStyle] = useState("");
  const [newInfluences, setNewInfluences] = useState("");
  const [newImg, setNewImg] = useState("");

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
    if (errorUser) {
      let { message } = errorUser;
      setMessage(message);
      toggleModal();
    }
  }, [dispatch, token]);

  const handleUpdate = async () => {
    setMessage(
      <form
        action=""
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div>
          <label htmlFor="nom">Ton nouveau nom : </label>
          <input
            type="text"
            placeholder={user.artisteName}
            onChange={(e) => {
              setNouveauNom(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="style">Ton nouveau style : </label>
          <input
            type="text"
            onChange={(e) => {
              setNewStyle(e.target.value);
            }}
            placeholder={artiste.style}
          />
        </div>
        <div>
          <label htmlFor="description">Ta nouvelle description : </label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            onChange={(e) => {
              setNewDescription(e.target.value);
            }}
            placeholder={artiste.description}
          ></textarea>
        </div>
        <div>
          <label htmlFor="influences">Tes nouvelles influences : </label>
          <input
            type="text"
            onChange={(e) => {
              setNewInfluences(e.target.value);
            }}
            placeholder={artiste.influences}
          />
        </div>
        <Button message={`Valider`} />
      </form>
    );
    toggleModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
  };

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
          <>
            <h2>Quelque chose cloche...</h2>
            <p>Essayes de contacter un admin</p>
          </>
        ) : user.artisteName && user.artisteName === nom ? (
          <>
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
            <Button message={`Changer mes données`} onClick={handleUpdate} />
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
        ) : user.errorUser ? (
          <h2>{user.errorUser}</h2>
        ) : (
          <h2>Quelque chose cloche...</h2>
        )}
      </main>
    </>
  );
};

export default PageArtiste;
