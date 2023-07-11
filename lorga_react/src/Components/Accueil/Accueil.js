import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import mc from "./acceuil.module.scss";
import { getRequest } from "../../api/api";
import { manageDate, manageDisplayDate } from "../../Helpers/dates";
import {
  GET_BOOKINGS,
  GET_COL_BY_ID,
  GET_COLLECTIFS,
} from "../../constants/constants";
// import photoPda from "../../public/medias/photoPda.jpg";

const Accueil = () => {
  const [dateDuJour, setDateDuJour] = useState("");
  // const [collectifs, setCollectifs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sets, setSets] = useState([]);
  const [displayDate, setDisplayDate] = useState("");
  const [articles, setArticles] = useState([]);
  const getCollectifById = async (id) => {
    const url = `${GET_COL_BY_ID}${id}`;
    let result = null;
    try {
      result = await getRequest(url);
      let error = result.error;
      let status = result.status;
      // let message = result.message;
      if (status >= 400) {
        return error.message;
      }
      return result.result.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
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
    const articles = bookings.map(async (booking) => {
      const { date, time, collectifId, description } = booking;
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
    const resolvedArticles = await Promise.all(articles);
    setArticles(resolvedArticles);
  }

  useEffect(() => {
    setDisplayDate(manageDisplayDate());
    setDateDuJour(manageDate());
    getBookings().then((result) => {
      setBookings(result.result.data);
    });
  }, []);
  useEffect(() => {
    if (bookings.length > 0) {
      sortBookings();
    }
    displayBookings();
  }, [bookings, dateDuJour]);
  async function sortBookings() {
    let djSets = bookings.filter(
      (booking) =>
        booking.collectifId &&
        booking.date.trim("T")[0] <= dateDuJour &&
        booking.confirmation !== false
    );
    setSets(djSets);
  }

  console.log(articles);
  return (
    <>
      <Header />
      <main className={`${mc.main}`}>
        <section>
          <article>
            <h2 className={`${mc.ntm}`}>today is {displayDate}</h2>
          </article>
        </section>
        <section>
          <h2>Les sets à venir : </h2>
          {articles.map((article) => {
            return (
              <>
                <article>
                  <h2>{article.nom}</h2>
                  <h3>
                    le {article.date} à {article.time}
                  </h3>
                  <p>{article.description}</p>
                  <p>{article.colDescr}</p>
                </article>
              </>
            );
          })}
        </section>
      </main>
    </>
  );
};

export default Accueil;
