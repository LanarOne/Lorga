import React, { useEffect, useState } from "react";
import { getUser } from "../../Helpers/usersHelper";
import Header from "../../Components/Header/Header";
import mc from "./admin.module.scss";
import { useDispatch } from "react-redux";
import { getUnconfirmedBookings } from "../../Redux/Reducers/bookings.slice";
import { getCollectifById } from "../../Redux/Reducers/createCollectif.slice";
import iconSet from "../../Style/IcoMoon/selection.json";
import IcomoonReact from "icomoon-react";
import {
  confirmBooking,
  deleteBooking,
} from "../../Redux/Reducers/booking.slice";
import Modale from "../../Components/smallElts/Modale/Modale";
import Button from "../../Components/smallElts/Button/Button";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const [unconfirmed, setUnconfirmed] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const handleDelete = async (e, id) => {
    e.preventDefault();
    let status;
    let error;
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
    console.log(response);
  };

  useEffect(() => {
    const getUserDatas = async () => {
      try {
        const userDatas = await getUser(token);
        setUser(userDatas);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    if (!token) {
      window.location.href = "/";
    } else {
      getUserDatas();
    }
    const getUnconf = async () => {
      const response = await dispatch(getUnconfirmedBookings({ token }));
      let { data } = response.payload;
      setUnconfirmed(data);
    };

    getUnconf();
  }, [token]);
  useEffect(() => {
    const displayUnconf = async () => {
      if (unconfirmed) {
        const bookings = [];
        for (const booking of unconfirmed) {
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
    displayUnconf();
  }, [unconfirmed]);
  if (user.roleId <= 4) {
    window.location.href = "/";
  }

  return (
    <div className={`${mc.container}`}>
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModale} />
        ) : null}
      </>
      <Header />
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
            {user.roleId === 6
              ? "5upaÄaDm!n"
              : user.roleId === 5
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
        </aside>
      </main>
    </div>
  );
};

export default Admin;
