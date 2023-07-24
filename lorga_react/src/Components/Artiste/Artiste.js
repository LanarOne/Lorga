import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { getAllArtistes } from "../../Helpers/artistesHelper";

const Artiste = () => {
  const [artistes, setArtistes] = useState([]);
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(false);

  const diplayArtistes = async () => {
    try {
      const articles = artistes.map(async (artiste) => {
        const { nom, description, influences, style } = artiste;
        return { nom, description, influences, style };
      });
      return await Promise.all(articles);
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      let result = null;
      try {
        result = await getAllArtistes();
        setArtistes(result);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    fetchData();
  }, [artistes.length]);
  return (
    <>
      <Header />
    </>
  );
};

export default Artiste;
