import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import mc from "./acceuil.module.scss";
import { getRequest } from "../../api/api";
import { manageDate } from "../../Helpers/dates";
import { GET_COL_BY_ID } from "../../constants/constants";
import photoPda from "../../public/medias/photoPda.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../Redux/Reducers/bookings.slice";

const Accueil = () => {
  const [dateDuJour, setDateDuJour] = useState("");
  const [bookings, setBookings] = useState([]);
  const [sets, setSets] = useState([]);
  const [opacity, setOpacity] = useState(1);

  const dispatch = useDispatch();
  const { data, loadingBooking, errorBooking } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);
  const getCollectifById = async (id) => {
    const url = `${GET_COL_BY_ID}${id}`;
    let result = null;
    try {
      result = await getRequest(url);
      let error = result.error;
      let status = result.status;
      // let message = result.message;
      if (status >= 400) {
        return new Error(error.message);
      }
      return result.result.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  function handleScroll() {
    const scrollPosition = window.scrollY;
    const threshold = 500;

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
  async function displayBookings() {
    try {
      const toDisplay = sets.map(async (set) => {
        const { date, time, collectifId, description } = set;
        const collectif = await getCollectifById(collectifId);
        let dateFr = `${date.slice(8, 10)}-${date.slice(5, 7)}-${date.slice(
          0,
          4
        )}`;
        let realTime = `${time.slice(0, 2)}h${time.slice(3, 5)}`;
        let nom = collectif.nom;
        let colDescr = collectif.description;
        return {
          date: dateFr,
          time: realTime,
          nom,
          description,
          colDescr,
        };
      });
      return await Promise.all(toDisplay);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  useEffect(() => {
    const manageData = async () => {
      try {
        if (data.length > 0) {
          const sorted = await sortBookings();
          setSets(sorted);
          if (sets.length > 0) {
            const result = await displayBookings();
            setBookings(result);
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    };
    setDateDuJour(manageDate());
    manageData();
  }, [data, sets.length]);
  async function sortBookings() {
    return data.filter(
      (booking) => booking.collectifId && booking.date >= dateDuJour
    );
  }

  return (
    <>
      <section className={`${mc.headerPhoto}`} style={{ opacity }}>
        <img
          src={photoPda}
          alt="Photo de la devanture du bar Lorganiq à bordeaux"
        />
      </section>
      <Header />
      <main className={`${mc.main}`}>
        <section>
          <h2>Les sets à venir : </h2>
          {loadingBooking ? (
            <h3>Informations en cours de chargement...</h3>
          ) : bookings.length > 0 ? (
            bookings.map((article) => {
              return (
                <>
                  <article
                    key={`${article.id}${article.nom}`}
                    className={`${mc.article}`}
                  >
                    <h2>{article.nom}</h2>
                    <h3>
                      le {article.date} à {article.time}
                    </h3>
                    <p>{article.description}</p>
                    <p>{article.colDescr}</p>
                  </article>
                </>
              );
            })
          ) : errorBooking ? (
            <p>{errorBooking}</p>
          ) : (
            <h3>Pas de sets prévus pour le moment :(</h3>
          )}
        </section>
      </main>
    </>
  );
};

export default Accueil;
