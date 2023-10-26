import React, { useEffect, useState } from "react";
import Header from "../header/header";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getArtisteByName,
  getDescription,
  getInfluences,
  getNom,
  getPhotoId,
  getStyle,
  updateArtiste,
} from "../../redux/reducers/createArtiste.slice";
import {
  getAlt,
  getPhoto,
  updatePhoto,
} from "../../redux/reducers/photo.slice";
import { getUpload } from "../../redux/reducers/uploads.slice";
import Modale from "../smallElts/modale/modale";
import { fetchUser } from "../../redux/reducers/user.slice";
import Button from "../smallElts/button/button";
import mc from "./pageArtiste.module.scss";
import { getUrl, postNewLien } from "../../redux/reducers/lien.slice";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { BsCheck } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import { BiLogoTiktok } from "react-icons/bi";
import {
  getLiensByArtiste,
  getLiensByCollectif,
} from "../../redux/reducers/liens.slice";

const PageArtiste = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { blaze } = useParams();
  const [artiste, setArtiste] = useState([]);
  const [message, setMessage] = useState(null);
  const [image, setImage] = useState({ file: null });
  const [photoAlt, setPhotoAlt] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [fbUrl, setFbUrl] = useState("");
  const [instaUrl, setInstaUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const { imageData, loadingUpload, errorUpload } = useSelector(
    (state) => state.upload
  );
  const { alt } = useSelector((state) => state.photo);
  const { loadingUser, errorUser } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const { url } = useSelector((state) => state.lien);
  const [img, setImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { nom, style, description, influences, loadingArtiste, errorArtiste } =
    useSelector((state) => state.artiste);
  const [adminMode, setAdminMode] = useState(false);

  if (!token) {
    window.location.href = "/login";
  }
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  useEffect(() => {
    const getArtiste = async () => {
      try {
        let nom = blaze;
        let response = await dispatch(getArtisteByName({ nom, token }));
        let status = response.payload.status;
        let error = response.payload.error;
        if (status <= 201) {
          setArtiste(await response.payload.data);
        }
        if (status >= 400 || error) {
          let { message } = response.payload;
          setMessage(message);
          toggleModal();
        }
      } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
      }
    };
    getArtiste();
  }, [dispatch, blaze, token]);
  useEffect(() => {
    if (artiste) {
      const displayUpload = async () => {
        let photoId = artiste.photoId;
        if (photoId) {
          const photo = await dispatch(getPhoto({ photoId, token }));
          if (
            photo &&
            photo.payload &&
            photo.payload.result &&
            photo.payload.result.data
          ) {
            setPhotoAlt(photo.payload.result.data.alt);
            const tempUrl = await photo.payload.result.data.path
              .replace(/\\/g, "/")
              .replace("uploads", "uploaded");
            const url = `photo/${tempUrl}`;
            const response = await dispatch(getUpload(url));
            setImg(await response.payload.result);
          }
        }
      };
      displayUpload();
    }
  }, [dispatch, artiste, token]);
  useEffect(() => {
    dispatch(fetchUser({ token }));
  }, [dispatch, token]);
  useEffect(() => {
    const getArtisteUrls = async () => {
      let error;
      let status;
      if (artiste) {
        let artisteId = artiste.id;
        const response = await dispatch(
          getLiensByArtiste({ artisteId, token })
        );
        status = response.payload.status;
        if (status === 200) {
          const { data } = response.payload;
          const fb = data.filter((url) => url.url.includes("facebook"));
          const insta = data.filter((url) => url.url.includes("instagram"));
          const tiktok = data.filter((url) => url.url.includes("tiktok"));
          if (fb.length > 0) {
            setFbUrl(fb[0].url);
          }
          if (insta.length > 0) {
            setInstaUrl(insta[0].url);
          }
          if (tiktok.length > 0) {
            setTiktokUrl(tiktok[0].url);
          }
        }
        if (status >= 400) {
          error = response.payload.error;
          if (status === 404) {
            console.log(error.message);
            return;
          }
          setMessage(error.message);
          toggleModal();
        }
      }
    };
    if (artiste && artiste.id) {
      getArtisteUrls();
    }
  }, [artiste]);
  const handleUpdate = async () => {
    setAdminMode(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const photoId = parseInt(artiste.photoId);
    const body = { nom, style, description, influences, photoId };
    const artisteId = artiste.id;
    const response = await dispatch(updateArtiste({ artisteId, body, token }));
    if (response && image) {
      try {
        const newPhoto = await dispatch(
          updatePhoto({ image, alt, token, photoId })
        );
      } catch (e) {
        console.error(e.message);
        setMessage(e.message);
        toggleModal();
      }
    }
  };
  const newLien = async (e) => {
    e.preventDefault();
    let status;
    let error;
    let artisteId = artiste.id;
    const body = { url, artisteId };
    const response = await dispatch(postNewLien({ body, token }));
    status = response.payload.status;
    if (status === 201) {
      let message = `Lien ajouté avec succès`;
      setMessage(message);
      toggleModal();
      setTimeout(() => {
        location.reload();
      }, 1200);
    }
    if (status === 404) {
      console.log(`pas de liens trouvés pour ce collectif`);
      return;
    }
    if (status >= 400) {
      error = response.payload.error;
      setMessage(error.message);
      toggleModal();
    }
  };
  useEffect(() => {
    const getData = async () => {
      await dispatch(getNom(artiste.nom));
      await dispatch(getStyle(artiste.style));
      await dispatch(getDescription(artiste.description));
      await dispatch(getInfluences(artiste.influences));
      await dispatch(getPhotoId(artiste.photoId));
    };
    if (artiste && artiste.nom) {
      getData();
    }
  }, [artiste]);
  const handleUpload = async (e) => {
    let image = e.target.files[0];
    setImage(image);
    if (image) {
      dispatch(getPhoto(image));
      setPreviewURL(URL.createObjectURL(image));
    }
  };
  return (
    <>
      <>
        {isOpen ? (
          <Modale
            message={message}
            setModaleOpen={(e) => {
              toggleModal(e);
            }}
          />
        ) : null}
      </>
      <Header />
      <main>
        {loadingUpload || loadingUser || loadingArtiste ? (
          <h2>Données en chargement</h2>
        ) : (user.artisteName && user.artisteName === blaze && adminMode) ||
          (user.roleId >= 6 && adminMode) ? (
          <section>
            <h2 className={`${mc.disclaimer}`}>
              Une fois le formulaire envoyé, ta page artiste sera désactivée le
              temps d'être validée par nos admins !
            </h2>
            <form
              action=""
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div>
                <label htmlFor="nom">Ton nouveau nom : </label>
                <input
                  type="text"
                  placeholder={user.artisteName}
                  onChange={(e) => {
                    dispatch(getNom(e.target.value));
                  }}
                />
              </div>
              <div>
                <label htmlFor="style">Ton nouveau style : </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getStyle(e.target.value));
                  }}
                  placeholder={artiste.style}
                />
              </div>
              <div>
                <label htmlFor="description">Ta nouvelle description : </label>
                <textarea
                  name="description"
                  id="description"
                  cols="30"
                  rows="10"
                  onChange={(e) => {
                    dispatch(getDescription(e.target.value));
                  }}
                  placeholder={artiste.description}
                ></textarea>
              </div>
              <div>
                <label htmlFor="influences">Tes nouvelles influences : </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getInfluences(e.target.value));
                  }}
                  placeholder={artiste.influences}
                />
              </div>
              <div>
                <label htmlFor="photo">
                  Téléverse une nouvelle photo (l'ancienne sera supprimée)
                </label>
                <input
                  type="file"
                  accept={"image/*"}
                  onChange={(e) => {
                    handleUpload(e);
                  }}
                />
                {previewURL ? <img src={previewURL} /> : null}
              </div>
              <div>
                <label htmlFor="alt">
                  Décris ta photo pour l'accessibilité
                </label>
                <textarea
                  name="alt"
                  id="alt"
                  cols="30"
                  rows="10"
                  onChange={(e) => {
                    dispatch(getAlt(e.target.value));
                  }}
                ></textarea>
              </div>
              <div className={`${mc.buttons}`}>
                <Button message={`Valider`} />
                <Button message={`Retour`} onClick={toggleAdminMode} />
              </div>
            </form>
          </section>
        ) : (user.artisteName && user.artisteName === blaze) ||
          user.roleId >= 6 ? (
          <>
            <section>
              <div>
                <img src={img} alt={photoAlt} />
              </div>
              <article>
                <h2>{artiste.nom}</h2>
                <p>{artiste.style}</p>
                <p>{artiste.description}</p>
                <p>{artiste.influences}</p>
              </article>
            </section>
            <Button message={`Changer mes données`} onClick={handleUpdate} />
          </>
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
          <h2>Quelque chose cloche...</h2>
        )}
        <section>
          <h2>Mes réseaux</h2>
          {!fbUrl ? (
            <form
              action="nouveauLien"
              onSubmit={(e) => {
                newLien(e);
              }}
            >
              <div className={`${mc.input}`}>
                <label htmlFor="url">
                  <FaFacebookF className={`${mc.sprites}`} />
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getUrl(e.target.value));
                  }}
                />
                <Button message={<BsCheck />} />
                <Button message={<RiCloseFill />} />
              </div>
            </form>
          ) : (
            <article>
              <NavLink to={fbUrl}>
                <FaFacebookF className={`${mc.sprites}`} />
              </NavLink>
            </article>
          )}
          {instaUrl ? (
            <article>
              <NavLink to={instaUrl}>
                <FaInstagram className={`${mc.sprites}`} />
              </NavLink>
            </article>
          ) : (
            <form
              action=""
              onSubmit={(e) => {
                newLien(e);
              }}
            >
              <div className={`${mc.input}`}>
                <label htmlFor="">
                  <FaInstagram className={`${mc.sprites}`} />
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getUrl(e.target.value));
                  }}
                />
                <Button message={<BsCheck />} />
                <Button message={<RiCloseFill />} />
              </div>
            </form>
          )}
          {tiktokUrl ? (
            <article>
              <NavLink to={tiktokUrl}>
                <BiLogoTiktok className={`${mc.sprites}`} />
              </NavLink>
            </article>
          ) : (
            <form
              action=""
              onSubmit={(e) => {
                newLien(e);
              }}
            >
              <div className={`${mc.input}`}>
                <label htmlFor="">
                  <BiLogoTiktok className={`${mc.sprites}`} />
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    dispatch(getUrl(e.target.value));
                  }}
                />
                <Button message={<BsCheck />} />
                <Button message={<RiCloseFill />} />
              </div>
            </form>
          )}
        </section>
      </main>
    </>
  );
};

export default PageArtiste;
