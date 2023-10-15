import mc from "./modale.module.scss";
import Button from "../button/button";
const Modale = ({ message, setModaleOpen }) => {
  const retourAcceuil = () => {
    window.location.href = "/";
  };
  const closeModale = () => {
    setModaleOpen(false);
  };
  return (
    <div className={`${mc.overlay}`} onClick={() => setModaleOpen(false)}>
      <section className={`${mc.modale}`} onClick={(e) => e.stopPropagation()}>
        <article className={`${mc.message}`}>{message}</article>
        <div className={`${mc.buttons}`}>
          <Button message={`retour à l'acceuil`} onClick={retourAcceuil} />
          <Button message={`Fermer`} onClick={closeModale} />{" "}
        </div>
      </section>
    </div>
  );
};

export default Modale;
