import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import mc from "./acceuil.module.scss";
import { getRequest } from "../../api/api";
// import photoPda from "../../public/medias/photoPda.jpg";

const Accueil = () => {
  const [dateDuJour, setDateDuJour] = useState("");
  const [collectifs, setCollectifs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sets, setSets] = useState([]);
  async function getCollectifs() {
    const url = "collectif/readall";
    let result = null;
    try {
      result = await getRequest(url);
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async function getBookings() {
    let result = null;
    const url = "booking/readall";
    try {
      result = await getRequest(url);
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  useEffect(() => {
    let dateDuJour = new Date().getDate();
    let moisEnCours = new Date().getMonth();
    let anneeEnCours = new Date().getFullYear();
    if (moisEnCours < 10) {
      moisEnCours = `0${new Date().getMonth() + 1}`;
    }
    if (moisEnCours >= 10) {
      moisEnCours = `${new Date().getMonth() + 1}`;
    }
    if (dateDuJour < 10) {
      dateDuJour = `0${new Date().getDate()}`;
    }
    const dateTotale = `${anneeEnCours}-${moisEnCours}-${dateDuJour}`;
    setDateDuJour(dateTotale);

    getBookings().then((result) => {
      setBookings(result.result.data);
    });
  }, []);
  useEffect(() => {
    if (bookings.length > 0) {
      sortBookings();
    }
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

  return (
    <>
      <Header />
      <main className={`${mc.main}`}>
        <section>
          <article>
            <h2 className={`${mc.ntm}`}>today is {dateDuJour}</h2>
          </article>
        </section>
        <section>
          <h2>Les sets à venir : </h2>
          {sets.map((set) => {
            return (
              <>
                <article>
                  <h3>Le {set.date}</h3>
                  <h4>à : {set.time}</h4>
                  <p>{set.description}</p>
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
