import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getArtisteByName } from "../../Redux/Reducers/createArtiste.slice";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
const PageArtiste = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { nom } = useParams();
  const [artiste, setArtiste] = useState([]);
  const [content, setContent] = useState([]);
  const { imageData, loading, error } = useSelector((state) => state.upload);
  const [img, setImg] = useState("");

  useEffect(() => {
    const getArtiste = async () => {
      let content;
      try {
        let response = await dispatch(getArtisteByName({ nom, token }));
        let status = response.payload.status;
        if (status <= 201) {
          setArtiste(await response.payload.result.data);
        }
        if (status >= 400) {
          console.log(response);
          setContent(<h2>{response.payload.message}</h2>);
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
        console.log(photo);
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
  return (
    <>
      <Header />
      <main>
        {loading ? (
          <h2>Données en chargement</h2>
        ) : error ? (
          <p>{error}</p>
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
          <p>{content}</p>
        )}
      </main>
    </>
  );
};

export default PageArtiste;
