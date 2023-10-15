import React, { useState } from "react";
import mc from "./addBoisson.module.scss";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getDescription,
  getFamille,
  getNom,
  getPhotoId,
  getRecette,
  getSaveurs,
  getType,
  postNewBoisson,
} from "../../Redux/Reducers/boisson.slice";
import Button from "../../components/smallElts/Button/Button";
import { getPhoto, postPhoto } from "../../Redux/Reducers/photo.slice";
import Modale from "../../components/smallElts/Modale/Modale";

const AddBoisson = () => {
  const dispatch = useDispatch();
  const boisson = useSelector((state) => state.boisson);
  const token = localStorage.getItem("token");
  const [previewURL, setPreviewURL] = useState("");
  const [image, setImage] = useState({ file: null });
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleModale = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let status;
    let error;
    try {
      if (image) {
        const newPhoto = await dispatch(postPhoto({ image, token }));
        if (newPhoto.error) {
          console.error(newPhoto.error);
        }
        const photoId = parseInt(newPhoto.payload.result.data.id);
        await dispatch(getPhotoId(photoId));
        const nom = boisson.nom;
        const famille = boisson.famille;
        const type = boisson.type;
        const description = boisson.description;
        const recette = boisson.recette;
        const saveurs = boisson.saveurs;
        const body = {
          nom,
          famille,
          type,
          description,
          recette,
          saveurs,
          photoId,
        };
        const response = await dispatch(postNewBoisson({ body, token }));
        status = response.payload.status;
        error = response.payload.error || null;
        if (status >= 400) {
          setMessage(error);
          toggleModale();
        }
        if (status <= 201) {
          location.href = "/carte";
        }
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  const handleUpload = async (e) => {
    let image = e.target.files[0];
    setImage(image);
    dispatch(getPhoto(image));
    if (image) {
      setPreviewURL(URL.createObjectURL(image));
    }
  };
  return (
    <>
      {isOpen ? (
        <>
          <Modale message={message} setModaleOpen={toggleModale} />
        </>
      ) : null}
      <Header />
      <main>
        <section>
          <h2>Nouvelle Boisson</h2>
          <form
            action=""
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="nom">Le nom de la boisson : </label>
              <input
                type="text"
                onChange={(e) => {
                  dispatch(getNom(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="famille">Choisis la famille de boisson : </label>
              <select
                name="famille"
                id="famille"
                onChange={(e) => {
                  dispatch(getFamille(e.target.value));
                }}
              >
                <option value="null">Choisis une famille</option>
                <option value="biere">Bière</option>
                <option value="cocktail">Cocktail</option>
                <option value="liqueur">Liqueur</option>
                <option value="shot">Shot</option>
                <option value="soft">Soft</option>
                <option value="spirit">Spirit</option>
                <option value="vin">Vin</option>
              </select>
            </div>
            <div>
              <label htmlFor="type">Type de boisson</label>
              {boisson.famille === "biere" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Type de la bière ?</option>
                    <option value="apa">APA</option>
                    <option value="blanche">Blanche</option>
                    <option value="blonde lager">Blonde - lager</option>
                    <option value="blonde ale">Blonde - ale</option>
                    <option value="brune">Brune</option>
                    <option value="ipa">IPA</option>
                    <option value="rousse">Rousse</option>
                    <option value="stout">Stout</option>
                  </select>
                </>
              ) : boisson.famille === "cocktail" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Base du cocktail?</option>
                    <option value="vodka">Base vodka</option>
                    <option value="rhum">Base rhum</option>
                    <option value="gin">Base gin</option>
                    <option value="tequila">Base tequila</option>
                    <option value="mocktail">Sans alcool</option>
                  </select>
                </>
              ) : boisson.famille === "liqueur" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Type de liqueur?</option>
                    <option value="fruit">Liqueur de fruit</option>
                    <option value="herbale">Liqueur herbale</option>
                  </select>
                </>
              ) : boisson.famille === "shot" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Type de shot?</option>
                    <option value="etage">À étages</option>
                    <option value="sirop">Avec du sirop</option>
                    <option value="pur">Pur</option>
                    <option value="shaked">Au shaker</option>
                  </select>
                </>
              ) : boisson.famille === "soft" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Type de soft</option>
                    <option value="jus">Jus de fruit</option>
                    <option value="soda">Soda</option>
                    <option value="eau">Eau pétillante</option>
                  </select>
                </>
              ) : boisson.famille === "spirit" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Type de spiritueux</option>
                    <option value="whisky">Whisky</option>
                    <option value="rhum">Rhum</option>
                    <option value="gin">Gin</option>
                    <option value="vodka">Vodka</option>
                    <option value="cognac">Cognac</option>
                    <option value="tequila">Tequila</option>
                    <option value="divers">Divers</option>
                  </select>
                </>
              ) : boisson.famille === "vin" ? (
                <>
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => {
                      dispatch(getType(e.target.value));
                    }}
                  >
                    <option value="null">Type de vin</option>
                    <option value="blanc">Blanc</option>
                    <option value="rouge">Rouge</option>
                    <option value="rose">Rosé</option>
                  </select>
                </>
              ) : null}
            </div>
            <div>
              <label htmlFor="description">Description de la boisson : </label>
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="10"
                onChange={(e) => {
                  dispatch(getDescription(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="recette">Recette de la boisson : </label>
              <textarea
                name="recette"
                id="recette"
                cols="30"
                rows="10"
                onChange={(e) => {
                  dispatch(getRecette(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="saveurs">Saveurs associées à la boisson : </label>
              <input
                type="text"
                onChange={(e) => {
                  dispatch(getSaveurs(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="photo">Photo de la boisson : </label>
              <input
                type="file"
                accept={"image/*"}
                onChange={(e) => {
                  handleUpload(e);
                }}
              />
              {previewURL ? <img src={previewURL} alt="" /> : null}
            </div>
            <Button message={`Envoyer`} />
          </form>
        </section>
      </main>
    </>
  );
};

export default AddBoisson;
