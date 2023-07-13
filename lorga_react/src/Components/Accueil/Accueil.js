import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import mc from "./acceuil.module.scss";
import { getRequest } from "../../api/api";
import { manageDate } from "../../Helpers/dates";
import { GET_BOOKINGS, GET_COL_BY_ID } from "../../constants/constants";
import photoPda from "../../public/medias/photoPda.jpg";

const Accueil = () => {
  const [dateDuJour, setDateDuJour] = useState("");
  // const [collectifs, setCollectifs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sets, setSets] = useState([]);
  const [articles, setArticles] = useState([]);
  const token = window.localStorage.getItem("token");
  const [opacity, setOpacity] = useState(1);
  const [loading, setLoading] = useState(false);

  const getCollectifById = async (id) => {
    const url = `${GET_COL_BY_ID}${id}`;
    let result = null;
    try {
      result = await getRequest(url);
      let error = result.error;
      let status = result.status;
      // let message = result.message;
      if (status >= 400) {
        throw new Error(error.message);
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

  async function getBookings() {
    let result = null;
    try {
      result = await getRequest(GET_BOOKINGS);

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async function displayBookings() {
    try {
      const articles = sets.map(async (set) => {
        if (set.confirmation) {
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
        }
      });
      return await Promise.all(articles);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBookings();
        const { error, status, result } = response;
        if (status >= 400) {
          console.error(error, status);
          return new Error(error.message);
        }
        setBookings(result.data);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const manageData = async () => {
      setLoading(true);
      try {
        if (bookings.length > 0) {
          const sorting = await sortBookings();
          setSets(sorting);
          if (sets.length > 0) {
            const result = await displayBookings();
            setArticles(result);
          }
        }
      } catch (error) {
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    };
    setDateDuJour(manageDate());
    manageData();
  }, [bookings, sets.length]);
  async function sortBookings() {
    return bookings.filter(
      (booking) =>
        booking.collectifId &&
        booking.date.trim("T")[0] <= dateDuJour &&
        booking.confirmation === true
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
          {loading ? (
            <h3>Informations en cours de chargement...</h3>
          ) : articles.length > 0 ? (
            articles.map((article) => {
              return (
                <>
                  <article key={`${article.id}${article.nom}`}>
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
          ) : (
            <h3>Pas de sets prévus pour le moment :(</h3>
          )}
        </section>
      </main>
    </>
  );
};

export default Accueil;
