import React, { useEffect, useState } from "react";
import logo from "../../public/medias/lorgaLogo.jpg";
import logo2 from "../../public/medias/lorgaLogo2.jpg";
import mc from "./header.module.scss";
import photoPda from "../../public/medias/photoPda.jpg";
const Header = () => {
  const [opacity, setOpacity] = useState(1);

  function handleScroll() {
    const scrollPosition = window.scrollY;
    const threshold = 300;

    const newOpacity = 1 - scrollPosition / threshold;
    const clampedOpacity = Math.max(0, Math.min(1, newOpacity));
    setOpacity(clampedOpacity);
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header>
      <div className={`${mc.headerPhoto}`} style={{ opacity }}>
        <img
          src={photoPda}
          alt="Photo de la devanture du bar Lorganiq à bordeaux"
        />
      </div>
      <div className={`${mc.blocLogo}`}>
        <img src={logo2} alt="Logo de Lorga" />
      </div>
    </header>
  );
};

export default Header;
