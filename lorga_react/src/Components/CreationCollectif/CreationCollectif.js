import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDescription,
  getInfluences,
  getNom,
  getPhotoId,
  getStyle,
  getUserId,
  postNewCollectif,
} from "../../Redux/Reducers/createCollectif.slice";
import { getPhoto, postPhoto } from "../../Redux/Reducers/photo.slice";
import { getUser } from "../../Helpers/usersHelper";
import Header from "../Header/Header";
import mc from "./creationCollectif.module.scss";
import Button from "../smallElts/Button/Button";
import Modale from "../smallElts/Modale/Modale";

const CreationCollectif = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { nom, description, influences, style } = useSelector(
    (state) => state.collectif
  );
  const [user, setUser] = useState([]);
  const [image, setImage] = useState({ file: null });
  const [previewURL, setPreviewURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
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
  const handleUpload = async (e) => {
    let image = e.target.files[0];
    setImage(image);
    dispatch(getPhoto(image));
    if (image) {
      setPreviewURL(URL.createObjectURL(image));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newPhoto = await dispatch(await postPhoto({ image, token }));
    if (newPhoto.error) {
      setMessage(newPhoto.payload.message);
      setIsOpen(true);
      return;
    }
    const photoId = newPhoto.payload.result.data.id;
    dispatch(getPhotoId(photoId));

    const userId = user.id;
    let body = { nom, description, influences, style, photoId, userId };
    try {
      const response = await dispatch(postNewCollectif({ body, token }));
      if (response.ok) {
        setMessage(
          `Ta demande sera étudiée et validée très prochaînement par les admins`
        );
        setIsOpen(true);
      }
      if (response.error) {
        setMessage(response.error.message);
        setIsOpen(true);
      }
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
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModal} />
        ) : null}
      </>
      <Header />
      <main>
        <section>
          <h2>Vos informations</h2>
          <p>
            Toutes les informations que tu partages ici seront publiées telles
            quelles dans ta page artiste et éventuellement en page d'accueil si
            tu es programmé chez nous! Elles seront bien sûr modifiables avant
            publication et nous nous réservons le droit d'ajuster (corriger les
            fautes)
          </p>
        </section>
        <section>
          <form
            action=""
            className={`${mc.collectifForm}`}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="nom">Le nom du collectif : </label>
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
                La description telle qu'elle apparaîtra sur la page collectif :{" "}
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
              <label htmlFor="influences">Vos influences musicale : </label>
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
                Quel(s) style(s) vous représente le mieux :{" "}
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
              <label htmlFor="photo">Téléverse ta meilleure photo : </label>
              <input
                type="file"
                accept={"image/*"}
                onChange={(e) => {
                  handleUpload(e);
                }}
              />
              {image ? <img src={previewURL} alt="preview" /> : null}
            </div>
            <Button message={"Envoyer la demande"} />
          </form>
        </section>
      </main>
    </>
  );
};

export default CreationCollectif;
