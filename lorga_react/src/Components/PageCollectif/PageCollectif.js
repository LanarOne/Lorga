import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCollectifByName } from "../../Redux/Reducers/createCollectif.slice";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
import Header from "../Header/Header";
import Modale from "../smallElts/Modale/Modale";
import artiste from "../Artiste/Artiste";

const PageCollectif = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { nom } = useParams();
  const [collectif, setCollectif] = useState([]);
  const [message, setMessage] = useState("");
  const { imageData, loading, error } = useSelector((state) => state.upload);
  const [img, setImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getCollectif = async () => {
      let status;
      let error;
      try {
        const response = await dispatch(getCollectifByName({ nom, token }));
        console.log(response);
        error = response.error;
        status = response.payload.status;
        if (error) {
          setMessage(error);
          toggleModal();
        }
        if (status <= 201) {
          setCollectif(await response.payload.result.data);
        }
        if (status >= 400) {
          setMessage(response.payload.message);
        }
      } catch (e) {
        throw e;
      }
    };
    getCollectif();
  }, [dispatch, nom, token]);
  useEffect(() => {
    if (collectif) {
      const displayUploaded = async () => {
        const photoId = collectif.photoId;
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
    }
  }, [dispatch, collectif, token]);
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
          {loading ? (
            <h2>Chargement des données...</h2>
          ) : error ? (
            setIsOpen(true)
          ) : collectif && img ? (
            <article>
              <div>
                <img src={img} alt={collectif.description} />
              </div>
              <div>
                <h2>{collectif.nom}</h2>
                <p>{collectif.style}</p>
                <p>{collectif.description}</p>
                <p>{collectif.influences}</p>
              </div>
            </article>
          ) : (
            <p>{error}</p>
          )}
        </section>
      </main>
    </>
  );
};

export default PageCollectif;
