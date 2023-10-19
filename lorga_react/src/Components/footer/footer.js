import React from "react";
import iconSet from "../../style/IcoMoon/selection.json";
import IcomoonReact from "icomoon-react";
import mc from "./footer.module.scss";

const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <a href="#">Retour en haut</a>
          </li>
          <li>
            <a href="/carte">Carte des boissons</a>
          </li>
          <li>
            <a href="/apropos">L'équipe/Contact</a>
          </li>
        </ul>
      </nav>
      <div className="blocSprites">
        <a href="https://instagram.com/lorganiq.bdx?igshid=NTc4MTIwNjQ2YQ==">
          <IcomoonReact
            icon={"instagram"}
            iconSet={iconSet}
            color={"#05F8FF"}
            size={40}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
