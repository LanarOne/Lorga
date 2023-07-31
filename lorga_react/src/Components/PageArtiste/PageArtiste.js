import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getArtisteByName } from "../../Redux/Reducers/createArtiste.slice";

const PageArtiste = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { nom } = useParams();
  const [artiste, setArtiste] = useState([]);
  const [content, setContent] = useState([]);

  useEffect(() => {
    const getArtiste = async () => {
      let content;
      try {
        let response = await dispatch(getArtisteByName({ nom, token }));
        let status = response.payload.status;
        if (status <= 201) {
          setArtiste(response.payload.result.data);
          content = (
            <section>
              <h2>{artiste.nom}</h2>
              <p>{artiste.style}</p>
              <p>{artiste.description}</p>
              <p>{artiste.influences}</p>
            </section>
          );
          setContent(content);
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
  }, [dispatch, content.length]);
  return (
    <>
      <Header />
      <main>{content}</main>
    </>
  );
};

export default PageArtiste;
