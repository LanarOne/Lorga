export const manageDate = () => {
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
  return `${anneeEnCours}-${moisEnCours}-${dateDuJour}`;
};
export const manageDisplayDate = () => {
  return new Date().toDateString();
};
