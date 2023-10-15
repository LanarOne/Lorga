import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import mc from "./admin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUnconfirmedBookings } from "../../Redux/Reducers/bookings.slice";
import {
  confirmCollectif,
  getCollectifById,
} from "../../Redux/Reducers/createCollectif.slice";
import iconSet from "../../style/IcoMoon/selection.json";
import IcomoonReact from "icomoon-react";
import {
  confirmBooking,
  deleteBooking,
} from "../../Redux/Reducers/booking.slice";
import Modale from "../../Components/smallElts/Modale/Modale";
import Button from "../../Components/smallElts/Button/Button";
import { getUnconfirmed } from "../../Redux/Reducers/collectifs.slice";
import { deletePhoto } from "../../Redux/Reducers/photo.slice";
import {
  getUserByID,
  isAdminCol,
  isArtisteAdmin,
  isUserArtiste,
  updateRoleId,
} from "../../Redux/Reducers/user.slice";
import { getUnconfirmedArtistes } from "../../Redux/Reducers/artistes.slice";
import {
  confirmArtiste,
  getArtisteById,
} from "../../Redux/Reducers/createArtiste.slice";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [unconfirmedBookings, setUnconfirmedBookings] = useState([]);
  const [unconfirmedCollectifs, setUnconfirmedCollectifs] = useState([]);
  const [unconfirmedArtistes, setUnconfirmedArtistes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [guestBookings, setGuestBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const isMounted = true;
  const user = useSelector((state) => state.user);
  const { loadingBookings } = useSelector((state) => state.bookings);
  const { loadingCollectifs } = useSelector((state) => state.collectifs);

  const dispatch = useDispatch();

  const toggleModale = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirm = async (e, id) => {
    e.preventDefault();
    let error;
    let status;
    const response = await dispatch(confirmBooking({ id, token }));
    status = response.payload.status;
    error = response.payload.error || null;
    if (status <= 201) {
      let { message } = response.payload;
      setMessage(message);
      toggleModale();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    if (status >= 400 || error) {
      let { message } = response.payload;
      setMessage(message);
      toggleModale();
    }
  };

  const handleCollectifConfirmation = async (e, id) => {
    e.preventDefault();
    let status;
    let error;
    try {
      const response = await dispatch(confirmCollectif({ id, token }));
      status = response.payload.status;
      error = response.error || null;
      if (status <= 201) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      if (status >= 400 || error) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  };

  const handleArtisteConfirmation = async (e, artisteId) => {
    e.preventDefault();
    let error;
    let status;
    try {
      const response = await dispatch(confirmArtiste({ artisteId, token }));
      status = response.payload.status;
      error = response.error || null;
      if (status === 200) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      if (status >= 400 || error) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (e) {
      console.error(e.message);
      throw new Error(e);
    }
  };
  const handleDelete = async (e, id) => {
    e.preventDefault();
    let status;
    let error;
    try {
      const response = await dispatch(deleteBooking({ id, token }));
      status = response.payload.status;
      error = response.error || null;
      if (status <= 201) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
      if (status >= 400 || error) {
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  };

  const handleCollectifDelete = async (e, id) => {
    e.preventDefault();
    let status;
    let error;
    try {
      const collectif = await dispatch(getCollectifById({ id, token }));
      status = collectif.payload.status;
      error = collectif.payload.error;
      if (status === 200) {
        const userId = collectif.payload.data.createurId;
        setUserId(userId);
        const photoId = collectif.payload.data.photoId;
        try {
          const response = await dispatch(deletePhoto({ photoId, token }));
          status = response.payload.status;
          error = response.payload.message;
          if (status === 200) {
            setIsDeleted(true);
          }
          if (status >= 400) {
            setMessage(error);
            toggleModale();
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (e) {
          throw new Error(e.message);
        }
      }
      if (status >= 400) {
        setMessage(error);
        toggleModale();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  };

  const handleArtisteDelete = async (e, artisteId) => {
    e.preventDefault();
    let error;
    let status;
    try {
      const artiste = await dispatch(getArtisteById({ artisteId, token }));
      status = artiste.payload.status;
      error = artiste.payload.error;
      if (status === 200) {
        setUserId(artiste.payload.data.userId);
        const photoId = artiste.payload.data.photoId;
        const deleteArtistePhoto = await dispatch(
          deletePhoto({ photoId, token })
        );
        setIsDeleted(true);
      }
      if (status >= 400) {
        setMessage(error);
        toggleModale();
      }
    } catch (e) {
      console.error(e.message);
      throw new Error(e);
    }
  };
  useEffect(() => {
    const changeUserRoleId = async () => {
      let error;
      let status;
      if (userId) {
        const user = await dispatch(getUserByID({ userId, token }));
        status = user.payload.status;
        if (status === 200) {
          if (user.payload.data.roleId >= 6) {
            return;
          }
          try {
            const isArtiste = await dispatch(isUserArtiste({ userId, token }));
            status = isArtiste.payload.status;
            error = isArtiste.error;
            if (status === 200) {
              const artisteId = isArtiste.payload.data.id;
              const isArtisteAdminCol = await dispatch(
                isArtisteAdmin({ artisteId, token })
              );
              status = isArtisteAdminCol.payload.status;
              if (status === 200) {
                const roleId = 3;
                const body = { roleId };
                const putRoleId = await dispatch(
                  updateRoleId({ body, userId, token })
                );
                status = putRoleId.payload.status;
                let message = putRoleId.payload.message;
                if (status === 200) {
                  setMessage(message);
                  toggleModale();
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
                if (status >= 400) {
                  setMessage(message);
                  toggleModale();
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
              }
              if (status >= 400) {
                const roleId = 2;
                const body = { roleId };
                const putRoleId = await dispatch(
                  updateRoleId({ body, userId, token })
                );
                status = putRoleId.payload.status;
                let message = putRoleId.payload.message;
                if (status === 200) {
                  setMessage(message);
                  toggleModale();
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
                if (status >= 400) {
                  setMessage(message);
                  toggleModale();
                }
              }
            }
            if (status >= 400 || error) {
              if (status === 404) {
                const isAdmin = await dispatch(isAdminCol({ userId, token }));
                status = isAdmin.payload.status;
                if (status === 200) {
                  const collectifs = isAdmin.payload.data;

                  if (collectifs.length <= 1 || !collectifs) {
                    const roleId = 1;
                    const body = { roleId };
                    const putRoleId = await dispatch(
                      updateRoleId({ body, userId, token })
                    );
                    status = putRoleId.payload.status;
                    let message = putRoleId.payload.message;
                    if (status === 200) {
                      setMessage(message);
                      toggleModale();
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                    if (status >= 400) {
                      setMessage(message);
                      toggleModale();
                    }
                  }
                  if (collectifs.length > 1) {
                    const roleId = 4;
                    const body = { roleId };
                    const putRoleId = await dispatch(
                      updateRoleId({ body, userId, token })
                    );
                    status = putRoleId.payload.status;
                    let message = putRoleId.payload.message;
                    if (status === 200) {
                      setMessage(message);
                      toggleModale();
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                    if (status >= 400) {
                      setMessage(message);
                      toggleModale();
                    }
                  }
                }
                if (status >= 400) {
                  if (status === 404) {
                    const roleId = 1;
                    const body = { roleId };
                    const putRoleId = await dispatch(
                      updateRoleId({ body, userId, token })
                    );
                    status = putRoleId.payload.status;
                    let message = putRoleId.payload.message;
                    if (status === 200) {
                      setMessage(message);
                      toggleModale();
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                    if (status >= 400) {
                      setMessage(message);
                      toggleModale();
                    }
                  }
                  let { message } = isAdmin.payload;
                  setMessage(message);
                  toggleModale();
                }
                return;
              }
              let { message } = isArtiste.payload.error;
              setMessage(message);
              toggleModale();
            }
            setIsDeleted(false);
          } catch (e) {
            throw new Error(e.message);
          }
        }
        if (status >= 400) {
          setMessage(user.payload.error);
          toggleModale();
        }
      }
    };
    if (isDeleted) {
      changeUserRoleId();
    }
  }, [isDeleted]);
  useEffect(() => {
    const getUnconfirmedBkgs = async () => {
      let status;
      let error;

      try {
        const response = await dispatch(getUnconfirmedBookings({ token }));
        status = response.payload.status;
        error = response.payload.error;
        if (status === 200) {
          let { data } = response.payload;
          setUnconfirmedBookings(data);
        }
        if (status >= 400 || error) {
          if (status === 404) {
            return;
          }
          let { message } = response.payload;
          setMessage(message);
          toggleModale();
        }
      } catch (e) {
        console.error(e.message);
        throw new Error(e);
      }
    };
    const getUnconfirmedCltfs = async () => {
      let status;
      let error;
      try {
        const response = await dispatch(getUnconfirmed({ token }));
        status = response.payload.status;
        error = response.payload.error || null;
        if (status <= 201) {
          let { data } = response.payload;
          setUnconfirmedCollectifs(data);
        }
        if (status >= 400 || error) {
          if (error) {
            let { message } = error;
            setMessage(message);
            toggleModale();
          }
        }
      } catch (e) {
        console.error(e);
        throw new Error(e.message);
      }
    };

    const getUnconfirmedArtistesList = async () => {
      let status;
      let error;
      try {
        const response = await dispatch(getUnconfirmedArtistes({ token }));
        status = response.payload.status;
        error = response.error || null;
        if (status === 200) {
          let { data } = response.payload;
          setUnconfirmedArtistes(data);
        }
        if (status >= 400 || error) {
          if (status === 404) {
            return;
          }
          if (error) {
            let message = response.payload.message;
            setMessage(message);
            toggleModale();
          }
        }
      } catch (e) {
        console.error(e.message);
        throw new Error(e);
      }
    };

    getUnconfirmedBkgs();
    getUnconfirmedCltfs();
    getUnconfirmedArtistesList();
  }, [token]);
  useEffect(() => {
    const displayUnconf = async () => {
      if (unconfirmedBookings) {
        const bookings = [];
        for (const booking of unconfirmedBookings) {
          let id = booking.collectifId;
          let response = await dispatch(getCollectifById({ id, token }));
          const collectif = response.payload.data;
          if (collectif) {
            bookings.push({
              collectifNom: collectif.nom,
              date: booking.date,
              time: booking.time,
              id: booking.id,
            });
          }
        }
        setBookings(bookings);
      }
    };
    const displayCustomerBookings = () => {
      const guestBookings = [];
      if (unconfirmedBookings) {
        for (const guestBooking of unconfirmedBookings) {
          if (!guestBooking.collectifId) {
            guestBookings.push({
              date: guestBooking.date,
              time: guestBooking.time,
              id: guestBooking.id,
              nbr_invite: guestBooking.nbr_invite,
              description: guestBooking.description,
            });
          }
        }
        setGuestBookings(guestBookings);
      }
    };
    displayUnconf();
    displayCustomerBookings();
  }, [unconfirmedBookings]);
  useEffect(() => {
    if (userId) {
      if (!user.userId) {
        window.location.href = "/";
      }
    }
  }, [userId]);

  return (
    <div className={`${mc.container}`}>
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModale} />
        ) : null}
      </>
      <Header />
      {loadingBookings || loadingCollectifs ? (
        <h2>Chargement des données...</h2>
      ) : (
        <main>
          <div className="blocArticle">
            <section>
              <h2>Gestion artistes & collectifs</h2>
              <article>
                <h3>Artistes</h3>
                <ul>
                  <li>Valider les demandes de création de page artiste</li>
                  <li>Valider un artiste sur une setlist</li>
                  <li>Valider une demande d'ajout sur un collectif</li>
                  <li>Créer une page artiste</li>
                </ul>
              </article>
              <article>
                <h3>Collectifs</h3>
                <ul>
                  <li>Valider les demandes de création de page collectif</li>
                  <li>Valider une demande de booking</li>
                  <li>Valider une demande d'ajout d'admin pour le collectif</li>
                  <li>Créer une page collectif</li>
                  <li>Créer une date pour un collectif</li>
                </ul>
              </article>
            </section>
            <section>
              <h2>Gestion clients</h2>
              <ul>
                <li>Valider une demande de réservation</li>
                <li>Proposer une date à un client</li>
                <li>Annuler une réservation</li>
                <li>Blacklist?</li>
              </ul>
            </section>
          </div>
          <aside>
            <h3>Admin : {user.username}</h3>
            <p>
              {user.roleId === 7
                ? "5upaÄaDm!n"
                : user.roleId === 6
                ? "Admin Lorga"
                : `T'as rien à foutre là è_é`}
            </p>
            <div>
              <ul>
                {bookings.map((booking) => {
                  return (
                    <>
                      <li>
                        {booking.collectifNom},{booking.date},{booking.time} :
                        <Button
                          message={
                            <IcomoonReact
                              icon={"vynil"}
                              iconSet={iconSet}
                              color={"#05F8FF"}
                              size={20}
                            />
                          }
                          onClick={(e) => {
                            handleConfirm(e, booking.id);
                          }}
                        />
                        <Button
                          message={"X"}
                          onClick={(e) => {
                            handleDelete(e, booking.id);
                          }}
                        />
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
            <div>
              <ul>
                {guestBookings.map((guestBooking) => {
                  return (
                    <>
                      <li>
                        {guestBooking.date}, {guestBooking.time},{" "}
                        {guestBooking.nbr_invite}, {guestBooking.description}
                        <Button
                          message={
                            <IcomoonReact
                              icon={"vynil"}
                              iconSet={iconSet}
                              color={"#05F8FF"}
                              size={20}
                            />
                          }
                          onClick={(e) => {
                            handleConfirm(e, guestBooking.id);
                          }}
                        />
                        <Button
                          message={"X"}
                          onClick={(e) => {
                            handleDelete(e, guestBooking.id);
                          }}
                        />
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
            <div>
              <ul>
                {unconfirmedCollectifs.map((unconfirmedCollectif) => {
                  return (
                    <li>
                      {unconfirmedCollectif.nom},{" "}
                      {unconfirmedCollectif.description}
                      <Button
                        message={
                          <IcomoonReact
                            icon={"vynil"}
                            iconSet={iconSet}
                            color={"#05F8FF"}
                            size={20}
                          />
                        }
                        onClick={(e) => {
                          handleCollectifConfirmation(
                            e,
                            unconfirmedCollectif.id
                          );
                        }}
                      />
                      <Button
                        message={"X"}
                        onClick={(e) => {
                          handleCollectifDelete(e, unconfirmedCollectif.id);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <ul>
                {unconfirmedArtistes.map((artiste) => {
                  return (
                    <li>
                      {artiste.nom}, {artiste.description}
                      <Button
                        message={
                          <IcomoonReact
                            icon={"vynil"}
                            iconSet={iconSet}
                            color={"#05F8FF"}
                            size={20}
                          />
                        }
                        onClick={(e) => {
                          handleArtisteConfirmation(e, artiste.id);
                        }}
                      />
                      <Button
                        message={`X`}
                        onClick={(e) => {
                          handleArtisteDelete(e, artiste.id);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
};

export default Admin;
