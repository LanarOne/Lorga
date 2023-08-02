import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getArtisteByName } from "../../Redux/Reducers/createArtiste.slice";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { API_URL } from "../../constants/constants";
const PageArtiste = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { nom } = useParams();
  const [artiste, setArtiste] = useState([]);
  const [content, setContent] = useState([]);
  const [photoId, setPhotoId] = useState(null);

  useEffect(() => {
    const getArtiste = async () => {
      let content;
      try {
        let response = await dispatch(getArtisteByName({ nom, token }));
        let status = response.payload.status;
        if (status <= 201) {
          setArtiste(await response.payload.result.data);
          if (artiste) {
            setPhotoId(artiste.photoId);
            if (photoId) {
              const photo = await dispatch(getPhoto({ photoId, token }));
              console.log(photo);
              const datas = photo.payload.result.data;
              let path = datas.path.replace(/\\/g, "/");

              content = (
                <section>
                  <div>
                    <img src={`${API_URL}uploaded/${path}`} alt="" />
                  </div>
                  <div>
                    <h2>{artiste.nom}</h2>
                    <p>{artiste.style}</p>
                    <p>{artiste.description}</p>
                    <p>{artiste.influences}</p>
                  </div>
                </section>
              );
              setContent(content);
            }
          }
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
  }, [dispatch, content.length, photoId]);
  return (
    <>
      <Header />
      <main>{content}</main>
    </>
  );
};

export default PageArtiste;
