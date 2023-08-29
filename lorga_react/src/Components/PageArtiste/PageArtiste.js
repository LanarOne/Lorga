import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getArtisteByName,
  getDescription,
  getInfluences,
  getNom,
  getPhotoId,
  getStyle,
  updateArtiste,
} from "../../Redux/Reducers/createArtiste.slice";
import { getPhoto, updatePhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
import Modale from "../smallElts/Modale/Modale";
import { fetchUser } from "../../Redux/Reducers/user.slice";
import Button from "../smallElts/Button/Button";
import mc from "./pageArtiste.module.scss";

const PageArtiste = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { blaze } = useParams();
  const [artiste, setArtiste] = useState([]);
  const [message, setMessage] = useState(null);
  const [image, setImage] = useState({ file: null });
  const [previewURL, setPreviewURL] = useState("");
  const { imageData, loadingUpload, errorUpload } = useSelector(
    (state) => state.upload
  );
  const { loadingUser, errorUser } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [img, setImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { nom, style, description, influences, loadingArtiste, errorArtiste } =
    useSelector((state) => state.artiste);
  const [adminMode, setAdminMode] = useState(false);

  if (!token) {
    window.location.href = "/login";
  }
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  useEffect(() => {
    const getArtiste = async () => {
      try {
        let nom = blaze;
        let response = await dispatch(getArtisteByName({ nom, token }));
        let status = response.payload.status;
        let error = response.payload.error;
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
  }, [dispatch, blaze, token]);
  useEffect(() => {
    if (artiste) {
      const displayUpload = async () => {
        let photoId = artiste.photoId;
        if (photoId) {
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
        }
      };
      displayUpload();
    }
  }, [dispatch, artiste, token]);
  useEffect(() => {
    dispatch(fetchUser({ token }));
    if (errorUser) {
      let { message } = errorUser;
      setMessage(message);
      toggleModal();
    }
  }, [dispatch, token]);

  const handleUpdate = async () => {
    setAdminMode(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const photoId = parseInt(artiste.photoId);
    const body = { nom, style, description, influences, photoId };
    const artisteId = artiste.id;
    const response = await dispatch(updateArtiste({ artisteId, body, token }));
    if (response && image) {
      try {
        const newPhoto = await dispatch(updatePhoto({ image, token, photoId }));
        console.log(newPhoto);
      } catch (e) {
        console.error(e.message);
      }
    }
  };
  useEffect(() => {
    const getData = async () => {
      await dispatch(getNom(artiste.nom));
      await dispatch(getStyle(artiste.style));
      await dispatch(getDescription(artiste.description));
      await dispatch(getInfluences(artiste.influences));
      await dispatch(getPhotoId(artiste.photoId));
    };
    if (artiste && artiste.nom) {
      getData();
    }
  }, [artiste]);
  const handleUpload = async (e) => {
    let image = e.target.files[0];
    setImage(image);
    if (image) {
      dispatch(getPhoto(image));
      setPreviewURL(URL.createObjectURL(image));
    }
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
        {loadingUpload || loadingUser || loadingArtiste ? (
          <h2>Données en chargement</h2>
        ) : errorArtiste || errorUser || errorUpload ? (
          <>
            <h2>Quelque chose cloche...</h2>
            <p>Essayes de contacter un admin</p>
          </>
        ) : user.artisteName && user.artisteName === blaze && adminMode ? (
          <section>
            <h2 className={`${mc.disclaimer}`}>
              Une fois le formulaire envoyé, ta page artiste sera désactivée le
              temps d'être validée par nos admins !
            </h2>
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
                    dispatch(getNom(e.target.value));
                  }}
                />
              </div>
              <div>
                <label htmlFor="style">Ton nouveau style : </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getStyle(e.target.value));
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
                    dispatch(getDescription(e.target.value));
                  }}
                  placeholder={artiste.description}
                ></textarea>
              </div>
              <div>
                <label htmlFor="influences">Tes nouvelles influences : </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getInfluences(e.target.value));
                  }}
                  placeholder={artiste.influences}
                />
              </div>
              <div>
                <label htmlFor="photo">
                  Téléverse une nouvelle photo (l'ancienne sera supprimée)
                </label>
                <input
                  type="file"
                  accept={"image/*"}
                  onChange={(e) => {
                    handleUpload(e);
                  }}
                />
                {previewURL ? <img src={previewURL} /> : null}
              </div>
              <div className={`${mc.buttons}`}>
                <Button message={`Valider`} />
                <Button message={`Retour`} onClick={toggleAdminMode} />
              </div>
            </form>
          </section>
        ) : user.artisteName && user.artisteName === blaze ? (
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
        ) : (
          <h2>Quelque chose cloche...</h2>
        )}
      </main>
    </>
  );
};

export default PageArtiste;
