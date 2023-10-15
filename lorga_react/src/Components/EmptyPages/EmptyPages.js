import React from "react";
import clubJesus from "../../public/medias/clubJesus.png";
import mc from "./emptyPages.module.scss";
import Header from "../header/header";

const EmptyPages = () => {
  return (
    <>
      <Header />
      <main>
        <h2>Il n'y a rien à cette URL</h2>
        <img src={clubJesus} alt="Jesus Christ DJing at Lorga brewpub" />
      </main>
    </>
  );
};

export default EmptyPages;
