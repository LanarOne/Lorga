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
} from "../../redux/reducers/createCollectif.slice";
import {
  getAlt,
  getPhoto,
  updatePhoto,
} from "../../redux/reducers/photo.slice";
import { getUpload } from "../../redux/reducers/uploads.slice";
import Header from "../header/header";
import Modale from "../smallElts/modale/modale";
import Button from "../smallElts/button/button";
import mc from "./pageCollectif.module.scss";
import { getPhotoId } from "../../redux/reducers/createArtiste.slice";
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
import { getBookingsByCollectif } from "../../redux/reducers/bookings.slice";
import { deleteSetlist, postSetlist } from "../../redux/reducers/setlist.slice";
import {
  deleteBooking,
  updateBooking,
} from "../../redux/reducers/booking.slice";
import { manageDate } from "../../helpers/dates";
import { getSetlistByBookingId } from "../../redux/reducers/setlists.slice";
const PageCollectif = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { blaze } = useParams();
  const [collectif, setCollectif] = useState([]);
  const [artistesRequests, setArtistesRequests] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [collectifBookings, setCollectifBookings] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [artisteId, setArtisteId] = useState(null);
  const [isNotPresent, setIsNotPresent] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedArtiste, setSelectedArtiste] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { loadingUpload } = useSelector((state) => state.upload);
  const user = useSelector((state) => state.user);
  const { loadingUser } = useSelector((state) => state.user);
  const { nom, style, description, influences, loadingCollectif } = useSelector(
    (state) => state.collectif
  );
  const { alt } = useSelector((state) => state.photo);
  const [img, setImg] = useState("");
  const [photoAlt, setPhotoAlt] = useState("");
  const [image, setImage] = useState({ file: null });
  const [previewURL, setPreviewURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [collectifId, setCollectifId] = useState(null);
  const [date, setDate] = useState("");
  const [descriptionBooking, setDescriptionBooking] = useState("");
  const [nbr_invite, setNbr_invite] = useState(null);
  const [time, setTime] = useState("");
  const [userId, setUserId] = useState(null);
  const dateToday = manageDate();

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
      setAdminMode(true);
    } else setAdminMode(false);
  };
  useEffect(() => {
    const artisteAddPending = () => {
      if (user && collectif && user.artisteName) {
        artistesRequests.map((artiste) => {
          if (artiste.nom === user.artisteName) {
            setIsNotPresent(false);
          }
        });
      }
    };
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
          setPhotoAlt(photo.payload.result.data.alt);
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
    const getEventDatas = async () => {
      let error;
      let status;
      let combinedData = [];
      try {
        const collectifId = collectif.id;
        const bookingsResponse = await dispatch(
          getBookingsByCollectif({ token, collectifId })
        );
        status = bookingsResponse.payload.status;
        if (status === 200) {
          const bookings = bookingsResponse.payload.data;
          if (bookings.length >= 1) {
            for (const booking of bookings) {
              let bookingId = booking.id;
              const artistesResponse = await dispatch(
                getSetlistByBookingId({ bookingId })
              );
              combinedData.push({
                booking: booking,
                artistes: artistesResponse.payload.data,
              });
            }
          }
          setCollectifBookings(combinedData);
        }
        if (status >= 400) {
          error = bookingsResponse.payload.error;
          console.error(error);
        }
      } catch (error) {
        console.error(error.message);
        throw new Error(error);
      }
    };
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
              if (colCrea === collectif.nom || user.roleId >= 6) {
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
    const getData = async () => {
      if (isAdmin) {
        await dispatch(getNom(collectif.nom));
        await dispatch(getStyle(collectif.style));
        await dispatch(getDescription(collectif.description));
        await dispatch(getInfluences(collectif.influences));
        await dispatch(getPhotoId(collectif.photoId));
      }
    };
    if (collectif) {
      getEventDatas();
    }
    if (collectif && collectif.nom) {
      getData();
    }

    isRightAdmin();
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
        const newPhoto = await dispatch(
          updatePhoto({ image, alt, token, photoId })
        );
        if (newPhoto.payload.status <= 201) {
          window.location.href = "/";
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  };

  const handleBookingUpdate = async (e, bookingId) => {
    e.preventDefault();
    let status;
    let error;
    try {
      const colBook = collectifBookings.find(
        (booking) => booking.booking.id === bookingId
      );
      const thisBooking = colBook.booking;
      if (!descriptionBooking && !time && !date) {
        setSelectedBooking(null);
        return;
      }
      if (!descriptionBooking) {
        setDescriptionBooking(thisBooking.description);
      }
      if (!time) {
        setTime(thisBooking.time);
      }
      if (!date) {
        setDate(thisBooking.date);
      }
      setNbr_invite(colBook.artistes.length);
      setCollectifId(thisBooking.collectifId);
      setUserId(thisBooking.userId);
      if (
        collectifId &&
        date &&
        descriptionBooking &&
        nbr_invite &&
        time &&
        userId
      ) {
        let description = descriptionBooking;
        const body = {
          description,
          time,
          date,
          nbr_invite,
          collectifId,
          userId,
        };
        const response = await dispatch(
          updateBooking({ bookingId, body, token })
        );
        console.log(response);
        status = response.payload.status;
        if (status === 200) {
          const { message } = response.payload;
          setMessage(message);
          toggleModal();
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error.message);
      throw new Error(error);
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
  const handleArtisteSelection = (e, artisteId) => {
    e.preventDefault();
    setArtisteId(parseInt(artisteId));
    setBookingId(parseInt(e.target.value));
  };

  const handleSetlistConfirmation = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      postSetlist({ artisteId, bookingId, token })
    );
    const status = response.payload.status;
    const error = response.payload.error;
    if (status === 201) {
      setSelectedArtiste(null);
      setMessage(response.payload.message);
      toggleModal();
    }
    if (status >= 400) {
      setSelectedArtiste(null);
      setMessage(error.message);
      toggleModal();
    }
  };
  const handleSetlistDelete = async (e, id) => {
    const response = await dispatch(deleteSetlist({ id, token }));
    let { status } = response.payload;
    if (status === 200) {
      let { message } = response.payload;
      setMessage(message);
      toggleModal();
    }
  };
  const handleEventDelete = async (e, id) => {
    e.preventDefault();
    try {
      let bookingId = parseInt(id);
      const setlistToDelete = await dispatch(
        getSetlistByBookingId({ bookingId })
      );
      let status = setlistToDelete.payload.status;
      if (status === 200) {
        const arrayToDelete = setlistToDelete.payload.data;
        arrayToDelete.map(async (toDelete) => {
          const id = parseInt(toDelete.setlistId);
          const deletion = await dispatch(deleteSetlist({ id, token }));
          console.log(deletion);
        });
      }

      const response = await dispatch(deleteBooking({ id, token }));
      status = response.payload.status;
      if (status === 200) {
        let message = response.payload.message;
        setMessage(message);
        toggleModal();
      }
      if (status >= 400) {
        let { error } = response.payload;
        setMessage(error.message);
        toggleModal();
      }
    } catch (e) {
      console.error(e.message);
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
                  {previewURL ? <img src={previewURL} alt={alt} /> : null}
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
                  <img src={img} alt={photoAlt} />
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
                <h3>Ils font partie du collectif : </h3>
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
              <article>
                <h3>Les prochaines dates : </h3>
                <ul>
                  {collectifBookings.length >= 1
                    ? collectifBookings.map((booking) => {
                        if (booking.booking.date >= dateToday) {
                          return (
                            <li>
                              {booking.booking.date}
                              <br />
                              {booking.booking.description}
                              <br />
                              {booking.artistes ? <span>Setlist:</span> : null}
                              <ul>
                                {booking.artistes &&
                                booking.artistes.length >= 1
                                  ? booking.artistes.map((artiste) => {
                                      return <li>{artiste.nom}</li>;
                                    })
                                  : null}
                              </ul>
                            </li>
                          );
                        }
                      })
                    : null}
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
              <div>
                <NavLink to={`/booking`}>
                  <Button message={`Proposer une date pour une soirée`} />
                </NavLink>
              </div>
              <article>
                {collectifBookings.length >= 1 ? (
                  <h3>Nos prochaines dates : </h3>
                ) : null}
                <ul>
                  {collectifBookings.length >= 1
                    ? collectifBookings.map((booking) => {
                        if (booking.booking.date >= dateToday) {
                          return (
                            <li key={booking.booking.id}>
                              <Button
                                message={`Update Booking`}
                                onClick={(e) => {
                                  setSelectedBooking(booking.booking.id);
                                }}
                              />

                              <ul>
                                {selectedBooking === booking.booking.id ? (
                                  <form
                                    action=""
                                    onSubmit={(e) => {
                                      handleBookingUpdate(
                                        e,
                                        booking.booking.id
                                      );
                                    }}
                                  >
                                    <div>
                                      <label htmlFor="date">
                                        Change la date:
                                      </label>
                                      <input
                                        type="date"
                                        name="date"
                                        placeholder={booking.booking.date}
                                        onChange={(e) => {
                                          setDate(e.target.value);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="time">
                                        Change l'heure:
                                      </label>
                                      <input
                                        type="time"
                                        name="date"
                                        placeholder={booking.booking.time}
                                        onChange={(e) => {
                                          setTime(e.target.value);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="descr">
                                        Change la description:
                                      </label>
                                      <textarea
                                        name="description"
                                        id="description"
                                        cols="30"
                                        rows="10"
                                        placeholder={
                                          booking.booking.description
                                        }
                                        onChange={(e) => {
                                          setDescriptionBooking(e.target.value);
                                        }}
                                      ></textarea>
                                    </div>
                                    <Button message={`Confirmer`} />
                                  </form>
                                ) : (
                                  <>
                                    <ul>
                                      <li>{booking.booking.date}</li>
                                      <li>{booking.booking.description}</li>
                                      <li>
                                        <Button
                                          message={"X"}
                                          onClick={(e) => {
                                            handleEventDelete(
                                              e,
                                              booking.booking.id
                                            );
                                          }}
                                        />
                                      </li>
                                    </ul>
                                  </>
                                )}
                                <li>
                                  {booking.artistes ? (
                                    <span>Setlist:</span>
                                  ) : null}
                                </li>
                                {booking.artistes
                                  ? booking.artistes.map((artiste) => {
                                      return (
                                        <li>
                                          {artiste.nom}{" "}
                                          <Button
                                            message={"X"}
                                            onClick={(e) => {
                                              handleSetlistDelete(
                                                e,
                                                artiste.setlistId
                                              );
                                            }}
                                          />
                                        </li>
                                      );
                                    })
                                  : null}
                              </ul>
                            </li>
                          );
                        }
                      })
                    : null}
                </ul>
              </article>
              <article>
                {artistesRequests.length >= 1 ? (
                  <h3>Ils aimeraient faire partie de ton collectif : </h3>
                ) : null}
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
                        <li key={artiste.id}>
                          <NavLink to={`/artistes/${artiste.nom}`}>
                            {artiste.nom}
                          </NavLink>
                          {selectedArtiste === artiste.id ? (
                            <form
                              onSubmit={(e) => {
                                handleSetlistConfirmation(e);
                              }}
                            >
                              <select
                                name="date"
                                onChange={(e) => {
                                  handleArtisteSelection(e, artiste.id);
                                }}
                              >
                                <option value="null">Choisis une date</option>
                                {collectifBookings
                                  ? collectifBookings.map((booking) => {
                                      if (booking.booking.date >= dateToday) {
                                        return (
                                          <option value={booking.booking.id}>
                                            {booking.booking.date}
                                          </option>
                                        );
                                      }
                                    })
                                  : null}
                              </select>
                              <Button message={`Valider`} />
                            </form>
                          ) : (
                            <Button
                              message={`Ajouter à une setlist`}
                              onClick={() => setSelectedArtiste(artiste.id)}
                            />
                          )}
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
