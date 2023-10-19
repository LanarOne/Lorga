import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./components/accueil/accueil";
import Login from "./components/login/login";
import SignUp from "./components/signUp/signUp";
import Admin from "./admin/pageAdmin/admin";
import EmptyPages from "./components/emptyPages/emptyPages";
import Apropos from "./components/apropos/apropos";
import Artiste from "./components/artiste/Artiste";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import CreationArtiste from "./components/creationArtiste/creationArtiste";
import PageArtiste from "./components/pageArtiste/pageArtiste";
import CreationCollectif from "./components/creationCollectif/creationCollectif";
import Collectif from "./components/collectif/collectif";
import PageCollectif from "./components/pageCollectif/pageCollectif";
import AddBoisson from "./admin/addBoisson/addBoisson";
import Carte from "./components/carte/carte";
import PageBoisson from "./components/pageBoisson/pageBoisson";
import Booking from "./components/booking/booking";
import ConfirmationEmail from "./components/confirmationEmail/confirmationEmail";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Accueil />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/admin"} element={<Admin />} />
          <Route path={"/apropos"} element={<Apropos />} />
          <Route path={"/artistes"} element={<Artiste />} />
          <Route path={"/nouvelartiste"} element={<CreationArtiste />} />
          <Route path={"/artistes/:blaze"} element={<PageArtiste />} />
          <Route path={"/collectifs"} element={<Collectif />} />
          <Route path={"/nouveaucollectif"} element={<CreationCollectif />} />
          <Route path={"/collectifs/:blaze"} element={<PageCollectif />} />
          <Route path={"/admin/addboisson"} element={<AddBoisson />} />
          <Route path={"/carte"} element={<Carte />} />
          <Route path={"/carte/:boissonid"} element={<PageBoisson />} />
          <Route path={"/booking"} element={<Booking />} />
          <Route
            path={"/confirmationemail/:confirmationToken"}
            element={<ConfirmationEmail />}
          />
          <Route path={"/*"} element={<EmptyPages />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
