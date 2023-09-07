import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import {
  getCollectifByCreateur,
  getCollectifByName,
  getDescription,
  getInfluences,
  getNom,
  getStyle,
  updateCollectif,
} from "../../Redux/Reducers/createCollectif.slice";
import { getPhoto, updatePhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";
import Header from "../Header/Header";
import Modale from "../smallElts/Modale/Modale";
import Button from "../smallElts/Button/Button";
import mc from "./pageCollectif.module.scss";
import { getPhotoId } from "../../Redux/Reducers/createArtiste.slice";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/api";
import {
  CONFIRM_ART_COL,
  CREATE_ART_COL,
  DELETE_ART_COL,
  GET_ART_COL_BY_COL,
  GET_ART_COL_BY_COLLECTIF,
} from "../../constants/constants";
const PageCollectif = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { blaze } = useParams();
  const [collectif, setCollectif] = useState([]);
  const [artistesRequests, setArtistesRequests] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [isNotPresent, setIsNotPresent] = useState(true);
  const [message, setMessage] = useState("");
  const { loadingUpload, errorUpload } = useSelector((state) => state.upload);
  const user = useSelector((state) => state.user);
  const { loadingUser, errorUser } = useSelector((state) => state.user);
  const {
    nom,
    style,
    description,
    influences,
    loadingCollectif,
    errorCollectif,
  } = useSelector((state) => state.collectif);
  const [img, setImg] = useState("");
  const [image, setImage] = useState({ file: null });
  const [previewURL, setPreviewURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  if (!token) {
    window.location.href = "/login";
  }
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const toggleAdminMode = async () => {
    let userId = user.userId;

    const isRightAdmin = await dispatch(
      getCollectifByCreateur({ userId, token })
    );
    if (isRightAdmin.payload.status <= 201) {
      setAdminMode(!adminMode);
    } else setAdminMode(false);
  };
  useEffect(() => {
    const isRightAdmin = async () => {
      let status;
      let error;
      if (collectif && user) {
        try {
          let userId = user.userId;
          const response = await dispatch(
            getCollectifByCreateur({ userId, token })
          );
          if (response) {
            status = await response.payload.status;
            error = await response.payload.error;
            if (status <= 201) {
              let colCrea = await response.payload.result.data.nom;
              if (colCrea === collectif.nom) {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            }
          }
        } catch (e) {
          throw new Error(e.message);
        }
      }
    };

    const artisteAddPending = () => {
      if (user && collectif && user.artisteName) {
        artistesRequests.map((artiste) => {
          if (artiste.nom === user.artisteName) {
            setIsNotPresent(false);
          }
        });
      }
    };
    isRightAdmin();
    artisteAddPending();
  }, [token, user, collectif]);
  useEffect(() => {
    const getCollectif = async () => {
      let status;
      let error;
      try {
        let nom = blaze;
        const response = await dispatch(getCollectifByName({ nom, token }));
        error = response.error;
        status = response.payload.status;
        if (error) {
          setMessage(error);
          toggleModal();
        }
        if (status <= 201) {
          setCollectif(await response.payload.result.data);
        }
        if (status >= 400) {
          setMessage(response.payload.message);
        }
      } catch (e) {
        throw e;
      }
    };
    getCollectif();
  }, [dispatch, blaze, token]);
  useEffect(() => {
    if (collectif) {
      const displayUploaded = async () => {
        const photoId = collectif.photoId;
        const photo = await dispatch(getPhoto({ photoId, token }));
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
      const getUnconfirmedArtistesRequest = async () => {
        let status;
        let error;
        if (collectif && collectif.id) {
          try {
            let url = `${GET_ART_COL_BY_COLLECTIF}${collectif.id}`;
            const response = await getRequest(url, token);
            status = response.status;
            error = response.error;
            if (status >= 400) {
              if (status === 404) {
                return;
              }
              let { message } = error;
              setMessage(message);
              toggleModal();
            }
            if (status <= 201) {
              setArtistesRequests(response.result.data);
            }
          } catch (e) {
            throw new Error(e.message);
          }
        }
      };
      displayUploaded();
      getUnconfirmedArtistesRequest();
    }
  }, [dispatch, collectif, token]);
  useEffect(() => {
    const getArtistes = async () => {
      let status;
      let error;
      if (collectif && collectif.id) {
        try {
          let url = `${GET_ART_COL_BY_COL}${collectif.id}`;
          const response = await getRequest(url, token);
          status = response.status;
          error = response.error;
          if (status <= 201) {
            setArtistes(response.result.data);
            artistes.map((artiste) => {
              if (artiste.nom === user.artisteName) {
                setIsNotPresent(false);
              }
            });
          }
          if (status === 404) {
            console.log(error);
            return;
          }
          if (status >= 400 || error) {
            let { message } = error;
            setMessage(message);
            toggleModal();
          }
        } catch (e) {
          throw new Error(e.message);
        }
      }
    };
    getArtistes();
  }, [user, collectif]);
  useEffect(() => {
    const getData = async () => {
      await dispatch(getNom(collectif.nom));
      await dispatch(getStyle(collectif.style));
      await dispatch(getDescription(collectif.description));
      await dispatch(getInfluences(collectif.influences));
      await dispatch(getPhotoId(collectif.photoId));
    };
    if (collectif && collectif.nom) {
      getData();
    }
  }, [collectif]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const photoId = parseInt(collectif.photoId);
    const collectifId = parseInt(collectif.id);
    const body = { nom, style, description, influences, photoId };
    const response = await dispatch(
      updateCollectif({ collectifId, body, token })
    );
    if (response && image) {
      try {
        const newPhoto = await dispatch(updatePhoto({ image, token, photoId }));
        if (newPhoto.payload.status <= 201) {
          window.location.href = "/";
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  };
  const handleUpdload = async (e) => {
    let image = e.target.files[0];
    setImage(image);
    if (image) {
      dispatch(getPhoto(image));
      setPreviewURL(URL.createObjectURL(image));
    }
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    let status;
    let error;
    try {
      let url = `${CREATE_ART_COL}${parseInt(user.artisteId)}`;
      let collectifId = parseInt(collectif.id);
      const body = { collectifId };
      const response = await postRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        window.location.reload();
      }
      if (status >= 400) {
        let { message } = error;
        setMessage(message);
        toggleModal();
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const handleAccept = async (e, requestId) => {
    e.preventDefault();
    let status;
    let error;
    try {
      let url = `${CONFIRM_ART_COL}${requestId}`;
      let body = {};
      const response = await putRequest(url, body, token);
      error = response.error;
      status = response.status;
      if (status === 404) {
        console.log(error);
      }
      if (status >= 400 || error) {
        setMessage(error);
        toggleModal();
      }
      if (status <= 201) {
        window.location.href = `/collectifs/${encodeURIComponent(
          collectif.nom
        )}`;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  const handleDelete = async (e, requestId) => {
    e.preventDefault();
    let status;
    let error;
    try {
      let url = `${DELETE_ART_COL}${parseInt(requestId)}`;
      const response = await deleteRequest(url, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let { message } = response.result;
        setMessage(message);
        toggleModal();
        if (!isOpen) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
      if (status >= 400) {
        let { message } = error;
        setMessage(message);
        toggleModal();
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  return (
    <>
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModal} />
        ) : null}
      </>
      <Header />
      <main>
        <section>
          {loadingUpload || loadingCollectif || loadingUser ? (
            <h2>Chargement des données...</h2>
          ) : adminMode && isAdmin ? (
            <article>
              <h2 className={`${mc.disclaimer}`}>
                Une fois le formulaire envoyé, ta page collectif sera désactivée
                le temps d'être validée par nos admins !
              </h2>
              <form
                action=""
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <div>
                  <label htmlFor="nom">Nouveau nom du collectif : </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getNom(e.target.value));
                    }}
                    placeholder={collectif.nom}
                  />
                </div>
                <div>
                  <label htmlFor="style">
                    Défini un nouveau style pour le collectif :{" "}
                  </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getStyle(e.target.value));
                    }}
                    placeholder={collectif.style}
                  />
                </div>
                <div>
                  <label htmlFor="description">
                    La nouvelle description :{" "}
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    cols="30"
                    rows="10"
                    onChange={(e) => {
                      dispatch(getDescription(e.target.value));
                    }}
                    placeholder={collectif.description}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="influences">
                    Les nouvelles influences du collectif :{" "}
                  </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      dispatch(getInfluences(e.target.value));
                    }}
                    placeholder={collectif.influences}
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
                      handleUpdload(e);
                    }}
                  />
                  {previewURL ? <img src={previewURL} alt="" /> : null}
                </div>
                <div className={`${mc.buttons}`}>
                  <Button message={`Envoyer`} />
                  <Button message={`Retour`} onClick={toggleAdminMode} />
                </div>
              </form>
            </article>
          ) : isAdmin ? (
            <article>
              <div>
                <img src={img} alt={collectif.description} />
              </div>
              <div>
                <h2>{collectif.nom}</h2>
                <p>{collectif.style}</p>
                <p>{collectif.description}</p>
                <p>{collectif.influences}</p>
              </div>

              <Button
                message={`Changer mes informations`}
                onClick={toggleAdminMode}
              />
            </article>
          ) : collectif && img ? (
            <>
              <article>
                <div>
                  <img src={img} alt={collectif.description} />
                </div>
                <div>
                  <h2>{collectif.nom}</h2>
                  <p>{collectif.style}</p>
                  <p>{collectif.description}</p>
                  <p>{collectif.influences}</p>
                </div>
                {user && user.artisteName && isNotPresent ? (
                  <Button
                    message={"Demander à rentrer dans le collectif"}
                    onClick={(e) => {
                      handleAddRequest(e);
                    }}
                  />
                ) : null}
              </article>
              <article>
                <h3>Ils font parti du collectif : </h3>
                <ul>
                  {artistes ? (
                    artistes.map((artiste) => {
                      if (artiste.nom === user.artisteName) {
                        return (
                          <li>
                            <NavLink
                              to={`/artistes/${artiste.nom}`}
                              className={`${mc.orange}`}
                            >
                              {artiste.nom}
                            </NavLink>
                          </li>
                        );
                      } else {
                        return (
                          <li>
                            <NavLink to={`/artistes/${artiste.nom}`}>
                              {artiste.nom}
                            </NavLink>
                          </li>
                        );
                      }
                    })
                  ) : (
                    <h3>Chargement...</h3>
                  )}
                </ul>
              </article>
            </>
          ) : (
            <p>{message}</p>
          )}
        </section>
        <section>
          {isAdmin ? (
            <>
              <article>
                <h3>Ils aimeraient faire partie de ton collectif : </h3>
                <ul>
                  {artistesRequests.map((artiste) => {
                    return (
                      <li key={artiste.id}>
                        <NavLink
                          to={`/artistes/${encodeURIComponent(artiste.nom)}`}
                        >
                          {artiste.nom}
                        </NavLink>
                        <Button
                          message={`♪`}
                          onClick={(e) => {
                            handleAccept(e, artiste.requestId);
                          }}
                        />
                        <Button
                          message={`×`}
                          className={`${mc.orange}`}
                          onClick={(e) => {
                            handleDelete(e, artiste.requestId);
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </article>
              <article>
                <h3>Ils font parti de ton collectif : </h3>
                <ul>
                  {artistes ? (
                    artistes.map((artiste) => {
                      return (
                        <li>
                          <NavLink to={`/artistes/${artiste.nom}`}>
                            {artiste.nom}
                          </NavLink>
                        </li>
                      );
                    })
                  ) : (
                    <h3>Chargement...</h3>
                  )}
                </ul>
              </article>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default PageCollectif;
