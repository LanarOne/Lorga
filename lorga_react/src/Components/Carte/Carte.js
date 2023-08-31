import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { getBoissons } from "../../Redux/Reducers/boissons.slice";
import Modale from "../smallElts/Modale/Modale";
import mc from "./carte.module.scss";
import { getPhoto } from "../../Redux/Reducers/photo.slice";
import { getUpload } from "../../Redux/Reducers/uploads.slice";

const Carte = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const { loadingBoissons, errorBoissons } = useSelector(
    (state) => state.boissons
  );
  const { loadingPhoto, errorPhoto } = useSelector((state) => state.photo);
  const [boissons, setBoissons] = useState([]);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token") || null;
  const user = useSelector((state) => state.user);
  const [bieres, setBieres] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [liqueurs, setLiqueurs] = useState([]);
  const [shots, setShots] = useState([]);
  const [softs, setSofts] = useState([]);
  const [spirits, setSpirits] = useState([]);
  const [vins, setVins] = useState([]);
  const [divers, setDivers] = useState([]);
  const [selected, setSelected] = useState("null");
  const [images, setImages] = useState([]);
  const toggleModale = () => {
    setIsOpen(!isOpen);
  };
  const handleSelect = (e) => {
    setSelected(e.target.value);
  };
  const displayUploaded = async (boisson) => {
    const photoId = boisson.photoId;
    const boissonId = boisson.id;
    const photo = await dispatch(getPhoto({ photoId }));
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
      setImages((prevImages) => ({
        ...prevImages,
        [boissonId]: response.payload.result,
      }));
    }
  };
  useEffect(() => {
    const getDatas = async () => {
      let status;
      let error;
      try {
        const response = await dispatch(getBoissons());
        status = response.payload.status;
        error = response.payload.error || null;
        if (status <= 201) {
          setBoissons(response.payload.data);
          boissons.forEach((boisson) => {
            if (boisson.photoId) {
              displayUploaded(boisson);
            }
          });
        }
        if (status >= 400) {
          let { message } = error;
          setMessage(message);
          toggleModale();
        }
      } catch (e) {
        throw new Error(e.message);
      }
    };

    getDatas();
  }, [boissons.length]);
  useEffect(() => {
    const sortDatas = async () => {
      if (boissons) {
        const bieresArr = [];
        const cocktailsArr = [];
        const liqueursArr = [];
        const shotsArr = [];
        const softsArr = [];
        const spiritsArr = [];
        const vinsArr = [];
        const diversArr = [];

        boissons.map((boisson) => {
          if (boisson.famille === "biere") {
            bieresArr.push(boisson);
          }
          if (boisson.famille === "cocktail") {
            cocktailsArr.push(boisson);
          }
          if (boisson.famille === "liqueur") {
            liqueursArr.push(boisson);
          }
          if (boisson.famille === "shot") {
            shotsArr.push(boisson);
          }
          if (boisson.famille === "soft") {
            softsArr.push(boisson);
          }
          if (boisson.famille === "spirit") {
            spiritsArr.push(boisson);
          }
          if (boisson.famille === "vin") {
            vinsArr.push(boisson);
          } else {
            diversArr.push(boisson);
          }
          setBieres(bieresArr);
          setCocktails(cocktailsArr);
          setLiqueurs(liqueursArr);
          setShots(shotsArr);
          setSofts(softsArr);
          setSpirits(spiritsArr);
          setVins(vinsArr);
          setDivers(diversArr);
        });
      }
    };
    sortDatas();
  }, [boissons]);
  return (
    <>
      <>{isOpen ? <Modale message={message} /> : null}</>
      <Header />
      <main>
        <h2>La carte des boissons</h2>
        {loadingBoissons || loadingPhoto ? (
          <h3>Chargement des données</h3>
        ) : (
          <section>
            <form action="">
              <div className={`${mc.formSection}`}>
                <label htmlFor="select">
                  Sélectionne le type de boisson que tu préfères :{" "}
                </label>
                <select
                  name="famille"
                  id="famille"
                  onChange={(e) => {
                    handleSelect(e);
                  }}
                >
                  <option value="null">Choisis une famille</option>
                  <option value="biere">Bière</option>
                  <option value="cocktail">Cocktail</option>
                  <option value="liqueur">Liqueur</option>
                  <option value="shot">Shot</option>
                  <option value="soft">Soft</option>
                  <option value="spirit">Spirit</option>
                  <option value="vin">Vin</option>
                </select>
              </div>
            </form>
          </section>
        )}
        {boissons.length > 0 ? (
          <>
            {selected === "null" || selected === "biere" ? (
              <section>
                <h3>Les Bières</h3>
                <p>Nos bières sont toutes brassées sur place</p>
                {bieres.map((biere) => {
                  return (
                    <article className={`${mc.boisson}`} key={biere.id}>
                      {images[biere.id] && (
                        <img
                          src={images[biere.id]}
                          alt={biere.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{biere.nom}</h4>
                        <p>{biere.type}</p>
                        <p>{biere.description}</p>
                        <p>{biere.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
            {selected === "null" || selected === "cocktail" ? (
              <section>
                <h3>Les cocktails</h3>
                {cocktails.map((cocktail) => {
                  return (
                    <article className={`${mc.boisson}`} key={cocktail.id}>
                      {images[cocktail.id] && (
                        <img
                          src={images[cocktail.id]}
                          alt={cocktail.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{cocktail.nom}</h4>
                        <p>{cocktail.type}</p>
                        <p>{cocktail.description}</p>
                        <p>{cocktail.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
            {selected === "null" || selected === "liqueur" ? (
              <section>
                <h3>Les liqueurs</h3>
                {liqueurs.map((liqueur) => {
                  return (
                    <article className={`${mc.boisson}`} key={liqueur.id}>
                      {images[liqueur.id] && (
                        <img
                          src={images[liqueur.id]}
                          alt={liqueur.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{liqueur.nom}</h4>
                        <p>{liqueur.type}</p>
                        <p>{liqueur.description}</p>
                        <p>{liqueur.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
            {selected === "null" || selected === "shot" ? (
              <section>
                <h3>Les shots</h3>
                {shots.map((shot) => {
                  return (
                    <article className={`${mc.boisson}`} key={shot.id}>
                      {images[shot.id] && (
                        <img
                          src={images[shot.id]}
                          alt={shot.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{shot.nom}</h4>
                        <p>{shot.type}</p>
                        <p>{shot.description}</p>
                        <p>{shot.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
            {selected === "null" || selected === "soft" ? (
              <section>
                <h3>Les softs</h3>
                {softs.map((soft) => {
                  return (
                    <article className={`${mc.boisson}`} key={soft.id}>
                      {images[soft.id] && (
                        <img
                          src={images[soft.id]}
                          alt={soft.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{soft.nom}</h4>
                        <p>{soft.type}</p>
                        <p>{soft.description}</p>
                        <p>{soft.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
            {selected === "null" || selected === "spirit" ? (
              <section>
                <h3>Les spiritueux</h3>
                {spirits.map((spirit) => {
                  return (
                    <article className={`${mc.boisson}`} key={spirit.id}>
                      {images[spirit.id] && (
                        <img
                          src={images[spirit.id]}
                          alt={spirit.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{spirit.nom}</h4>
                        <p>{spirit.type}</p>
                        <p>{spirit.description}</p>
                        <p>{spirit.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
            {selected === "null" || selected === "vin" ? (
              <section>
                <h3>Les vins</h3>
                {vins.map((vin) => {
                  return (
                    <article className={`${mc.boisson}`} key={vin.id}>
                      {images[vin.id] && (
                        <img
                          src={images[vin.id]}
                          alt={vin.nom}
                          loading="lazy"
                        />
                      )}
                      <div className={`${mc.blocText}`}>
                        <h4>{vin.nom}</h4>
                        <p>{vin.type}</p>
                        <p>{vin.description}</p>
                        <p>{vin.saveurs}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}
          </>
        ) : (
          <h2>Quelque chose cloche?</h2>
        )}
      </main>
    </>
  );
};

export default Carte;
