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
import {
  deleteLien,
  getUrl,
  postNewLien,
  updateLien,
} from "../../redux/reducers/lien.slice";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { BsCheck } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import { BiLogoTiktok } from "react-icons/bi";
import {
  getLiensByArtiste,
  getLiensByCollectif,
} from "../../redux/reducers/liens.slice";
import { getSetlistByArtId } from "../../redux/reducers/setlists.slice";
import { dateEnFrancais, manageDate } from "../../helpers/dates";
import { getCollectifById } from "../../redux/reducers/createCollectif.slice";

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
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [fbId, setFbId] = useState(null);
  const [instaId, setInstaId] = useState(null);
  const [tiktokId, setTiktokId] = useState(null);
  const [img, setImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [artisteSetlist, setArtisteSetlist] = useState([]);
  const [displayEvent, setDisplayEvent] = useState([]);

  const { imageData, loadingUpload, errorUpload } = useSelector(
    (state) => state.upload
  );
  const { alt } = useSelector((state) => state.photo);
  const { loadingUser, errorUser } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const { url } = useSelector((state) => state.lien);
  const { nom, style, description, influences, loadingArtiste, errorArtiste } =
    useSelector((state) => state.artiste);

  const dateToday = manageDate();

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
            setFbId(fb[0].id);
          }
          if (insta.length > 0) {
            setInstaUrl(insta[0].url);
            setInstaId(insta[0].id);
          }
          if (tiktok.length > 0) {
            setTiktokUrl(tiktok[0].url);
            setTiktokId(tiktok[0].id);
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
    const getArtisteSetlists = async () => {
      let error;
      let status;
      const artisteId = parseInt(artiste.id);
      const response = await dispatch(getSetlistByArtId({ artisteId, token }));
      status = response.payload.status;
      if (status === 200) {
        const { data } = response.payload;
        const setlists = [];
        for (const setlist of data) {
          if (setlist.date >= dateToday) {
            setlists.push(setlist);
          }
        }
        setArtisteSetlist(setlists);
      }
      if (status >= 400) {
        error = response.payload.error;
        if (status === 404) {
          console.error(error.message);
          return;
        }
        let { message } = error;
        setMessage(message);
        toggleModal();
      }
    };
    if (artiste && artiste.id) {
      getArtisteUrls();
      getArtisteSetlists();
    }
  }, [artiste]);
  useEffect(() => {
    const displaySetlist = async () => {
      console.log(artisteSetlist);
      const displayedSetlists = [];
      for (const setlist of artisteSetlist) {
        let id = parseInt(setlist.collectifId);
        const response = await dispatch(getCollectifById({ id, token }));
        const collectif = response.payload.data;
        console.log(collectif);
        const dateFr = dateEnFrancais(setlist.date);
        const toDisplay = {
          date: dateFr,
          heure: setlist.time,
          description: setlist.description,
        };
        const event = { collectif, toDisplay };
        displayedSetlists.push(event);
      }
      setDisplayEvent(displayedSetlists);
    };
    displaySetlist();
  }, [artisteSetlist.length]);

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
      console.log(`pas de liens trouvés pour cet artiste`);
      return;
    }
    if (status >= 400) {
      error = response.payload.error;
      setMessage(error.message);
      toggleModal();
    }
  };
  const updateColLien = async (e, id) => {
    e.preventDefault();
    let error;
    let status;
    let artisteId = artiste.id;
    const body = { url, artisteId };
    const response = await dispatch(updateLien({ id, body, token }));
    status = response.payload.status;
    if (status === 200) {
      setMessage(response.payload.message);
      toggleModal();
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
    if (status >= 400) {
      error = response.payload.error;
      let { message } = error;
      setMessage(message);
      toggleModal();
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  };
  const handleLienDelete = async (e, id) => {
    e.preventDefault();
    let status;
    let error;
    const response = await dispatch(deleteLien({ id, token }));
    status = response.payload.status;
    if (status === 200) {
      let { message } = response.payload;
      setMessage(message);
      toggleModal();
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
    if (status >= 400) {
      error = response.payload.error;
      let { message } = error;
      setMessage(message);
      toggleModal();
      setTimeout(() => {
        location.reload();
      }, 1000);
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
          {!fbUrl && adminMode ? (
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
              </div>
            </form>
          ) : fbUrl && adminMode ? (
            <>
              {selectedUrl === fbId ? (
                <>
                  <h3>Veux-tu supprimer ce lien?</h3>
                  <Button
                    message={"confirmer"}
                    onClick={(e) => {
                      handleLienDelete(e, fbId);
                    }}
                  />
                </>
              ) : (
                <form
                  action="nouveauLien"
                  onSubmit={(e) => {
                    updateColLien(e, fbId);
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
                      placeholder={fbUrl}
                    />
                    <Button message={<BsCheck />} />
                  </div>
                  <Button
                    message={<RiCloseFill />}
                    onClick={(e) => {
                      setSelectedUrl(fbId);
                    }}
                  />
                </form>
              )}
            </>
          ) : fbUrl ? (
            <article>
              <NavLink to={fbUrl}>
                <FaFacebookF className={`${mc.sprites}`} />
              </NavLink>
            </article>
          ) : null}
          {!instaUrl && adminMode ? (
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
              </div>
            </form>
          ) : instaUrl && adminMode ? (
            <>
              {selectedUrl === instaId ? (
                <>
                  <h3>Veux-tu supprimer ce lien?</h3>
                  <Button
                    message={"confirmer"}
                    onClick={(e) => {
                      handleLienDelete(e, instaId);
                    }}
                  />
                </>
              ) : (
                <form
                  action="nouveauLien"
                  onSubmit={(e) => {
                    updateColLien(e, instaId);
                  }}
                >
                  <div className={`${mc.input}`}>
                    <label htmlFor="url">
                      <FaInstagram className={`${mc.sprites}`} />
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        dispatch(getUrl(e.target.value));
                      }}
                      placeholder={instaUrl}
                    />
                    <Button message={<BsCheck />} />
                  </div>
                  <Button
                    message={<RiCloseFill />}
                    onClick={(e) => {
                      setSelectedUrl(instaId);
                    }}
                  />
                </form>
              )}
            </>
          ) : instaUrl ? (
            <article>
              <NavLink to={instaUrl}>
                <FaInstagram className={`${mc.sprites}`} />
              </NavLink>
            </article>
          ) : null}
          {!tiktokUrl && adminMode ? (
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
              </div>
            </form>
          ) : tiktokUrl && adminMode ? (
            <>
              {selectedUrl === tiktokId ? (
                <>
                  <h3>Veux-tu supprimer ce lien?</h3>
                  <Button
                    message={"confirmer"}
                    onClick={(e) => {
                      handleLienDelete(e, tiktokId);
                    }}
                  />
                </>
              ) : (
                <form
                  action="nouveauLien"
                  onSubmit={(e) => {
                    updateColLien(e, tiktokId);
                  }}
                >
                  <div className={`${mc.input}`}>
                    <label htmlFor="url">
                      <BiLogoTiktok className={`${mc.sprites}`} />
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        dispatch(getUrl(e.target.value));
                      }}
                      placeholder={tiktokUrl}
                    />
                    <Button message={<BsCheck />} />
                  </div>
                  <Button
                    message={<RiCloseFill />}
                    onClick={(e) => {
                      setSelectedUrl(tiktokId);
                    }}
                  />
                </form>
              )}
            </>
          ) : tiktokUrl ? (
            <article>
              <NavLink to={tiktokUrl}>
                <BiLogoTiktok className={`${mc.sprites}`} />
              </NavLink>
            </article>
          ) : null}
        </section>
        <section>
          <h2>Ses prochaines dates : </h2>
          <ul>
            {displayEvent.map((event) => {
              return (
                <li>
                  Le {event.toDisplay.date} à {event.toDisplay.heure} avec le
                  collectif {event.collectif.nom}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
};

export default PageArtiste;
