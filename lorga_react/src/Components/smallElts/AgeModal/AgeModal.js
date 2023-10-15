import React, { useState } from "react";
import mc from "./ageModal.module.scss";
import Button from "../button/button";

const AgeModal = ({ setModalOpen }) => {
  const [dob, setDob] = useState("");

  const handleSave = () => {
    localStorage.setItem("userDOB", dob);
    setModalOpen(false);
  };

  return (
    <div className={`${mc.overlay}`}>
      <section className={`${mc.modal}`}>
        <h2>Précise ta date de naissance : </h2>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <Button onClick={handleSave} message={`Envoyer`} />
      </section>
    </div>
  );
};

export default AgeModal;
