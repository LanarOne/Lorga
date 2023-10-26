import React from "react";
import iconSet from "../../style/IcoMoon/selection.json";
import IcomoonReact from "icomoon-react";
import mc from "./footer.module.scss";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

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
          <FaInstagram />
        </a>
        <a href="https://facebook.com/lorganiq">
          <FaFacebookF />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
