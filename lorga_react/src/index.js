import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./components/accueil/Accueil";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Admin from "./Admin/pageAdmin/Admin";
import EmptyPages from "./components/EmptyPages/EmptyPages";
import Apropos from "./components/apropos/Apropos";
import Artiste from "./components/artiste/Artiste";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import CreationArtiste from "./components/CreationArtiste/CreationArtiste";
import PageArtiste from "./components/PageArtiste/PageArtiste";
import CreationCollectif from "./components/CreationCollectif/CreationCollectif";
import Collectif from "./components/Collectif/Collectif";
import PageCollectif from "./components/PageCollectif/PageCollectif";
import AddBoisson from "./admin/addBoisson/AddBoisson";
import Carte from "./components/Carte/Carte";
import PageBoisson from "./components/PageBoisson/PageBoisson";
import Booking from "./components/booking/Booking";
import ConfirmationEmail from "./components/ConfirmationEmail/ConfirmationEmail";

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
