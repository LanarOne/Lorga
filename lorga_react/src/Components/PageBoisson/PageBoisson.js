import React, { useEffect, useState } from "react";
import Header from "../header/header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mc from "./pageBoisson.module.scss";
import {
  deleteBoisson,
  getDescription,
  getFamille,
  getNom,
  getOneBoisson,
  getRecette,
  getSaveurs,
  getType,
  updateBoisson,
} from "../../redux/reducers/boisson.slice";
import Modale from "../smallElts/modale/modale";
import { getPhoto, updatePhoto } from "../../redux/reducers/photo.slice";
import { getUpload } from "../../redux/reducers/uploads.slice";
import Button from "../smallElts/button/button";

const PageBoisson = () => {
  const { boissonid } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user);
  const {
    nom,
    famille,
    type,
    description,
    recette,
    saveurs,
    photoId,
    loadingBoisson,
    errorBoisson,
  } = useSelector((state) => state.boisson);
  const { loadingPhoto } = useSelector((state) => state.photo);
  const [boisson, setBoisson] = useState({});
  const [message, setMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [img, setImg] = useState();
  const [image, setImage] = useState({ file: null });
  const [adminMode, setAdminMode] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  const toggleModale = () => {
    setIsOpen(!isOpen);
  };
  const toggleAdminMode = () => {
    setAdminMode(true);
  };

  const handleUpdload = async (e) => {
    let image = e.target.files[0];
    setImage(image);
    if (image) {
      dispatch(getPhoto(image));
      setPreviewURL(URL.createObjectURL(image));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let status;
    let error;
    // const photoId = parseInt(boisson.photoId);
    const id = parseInt(boissonid);
    const body = { nom, famille, type, description, recette, saveurs, photoId };
    try {
      const response = await dispatch(updateBoisson({ id, body, token }));
      status = response.payload.status;
      error = response.payload.error;
      if (status <= 201) {
        if (image) {
          const newPhoto = await dispatch(
            updatePhoto({ image, token, photoId })
          );
          status = newPhoto.payload.status;
          error = newPhoto.payload.error;
          if (status <= 201) {
            location.href = "/carte";
          }
          if (status >= 400 || error) {
            let { message } = error;
            setMessage(message);
            toggleModale();
            if (!isOpen) {
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
            return;
          }
        }
        location.href = "/carte";
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

  const deletePopUp = () => {
    let message = (
      <>
        <h2>Est-tu sûr(e) de vouloir supprimer cette boisson?</h2>
        <Button
          message={`Certain(e)`}
          onClick={() => {
            handleDelete();
          }}
        />
      </>
    );
    setMessage(message);
    toggleModale();
  };

  const handleDelete = async () => {
    let status;
    let error;
    toggleModale();
    try {
      let id = parseInt(boissonid);
      const response = await dispatch(deleteBoisson({ id, token }));
      console.log(response);
      status = response.payload.status;
      if (status <= 201) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          window.location.href = `/carte`;
        }, 2000);
      }
      if (status >= 400) {
        error = response.payload.error;
        let { message } = error;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          window.location.href = `/carte`;
        }, 2000);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    const getBoisson = async () => {
      let error;
      let status;

      try {
        const id = parseInt(boissonid);
        const response = await dispatch(getOneBoisson({ id, token }));
        status = response.payload.status;
        if (status <= 201) {
          setBoisson(response.payload.data);
        }
        if (status >= 400) {
          error = response.payload.error;
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
    const getDatas = async () => {
      await dispatch(getNom(boisson.nom));
      await dispatch(getType(boisson.type));
      await dispatch(getFamille(boisson.famille));
      await dispatch(getDescription(boisson.description));
      await dispatch(getSaveurs(boisson.saveurs));
      await dispatch(getRecette(boisson.recette));
    };
    displayUploaded();
    if (boisson) {
      getDatas();
    }
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
          {loadingBoisson || loadingPhoto ? (
            <h2>Chargement des données...</h2>
          ) : boisson && adminMode && user.roleId >= 5 ? (
            <>
              <h2>Modifie les données : </h2>
              <p>Ce que tu ne remplis pas ne sera pas modifié</p>
              <form
                action=""
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <div>
                  <label htmlFor="nom">Nouveau nom : </label>

                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getNom(e.target.value));
                    }}
                    placeholder={boisson.nom}
                  />
                </div>
                <div>
                  <label htmlFor="famille">Nouvelle famille : </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getFamille(e.target.value));
                    }}
                    placeholder={boisson.famille}
                  />
                </div>
                <div>
                  <label htmlFor="type">Nouveau type de boisson : </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                    placeholder={boisson.type}
                  />
                </div>
                <div>
                  <label htmlFor="description">Nouvelle description : </label>
                  <textarea
                    type="text"
                    onChange={(e) => {
                      dispatch(getDescription(e.target.value));
                    }}
                    placeholder={boisson.description}
                  />
                </div>
                <div>
                  <label htmlFor="saveurs">Nouvelles saveurs : </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getSaveurs(e.target.value));
                    }}
                    placeholder={boisson.saveurs}
                  />
                </div>
                <div>
                  <label htmlFor="recette">Nouvelle recette : </label>
                  <textarea
                    type="text"
                    onChange={(e) => {
                      dispatch(getRecette(e.target.value));
                    }}
                    placeholder={boisson.recette}
                  />
                </div>
                <div>
                  <label htmlFor="photo">
                    Nouvelle photo (l'ancienne sera supprimée) :{" "}
                  </label>
                  <input
                    type="file"
                    accept={"image/*"}
                    onChange={(e) => {
                      handleUpdload(e);
                    }}
                  />
                  {}
                </div>
                <Button message={`Enregistrer les modifications`} />
              </form>
            </>
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
                  <>
                    <Button
                      message={`Modifier cette boisson`}
                      onClick={toggleAdminMode}
                    />
                    <Button
                      message={`Supprimer cette boisson`}
                      onClick={deletePopUp}
                    />
                  </>
                ) : null}
              </div>
            </article>
          ) : (
            <h2>Quelque chose cloche...</h2>
          )}
        </section>
      </main>
    </>
  );
};

export default PageBoisson;
