import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./Components/Accueil/Accueil";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Admin from "./Admin/pageAdmin/Admin";
import EmptyPages from "./Components/EmptyPages/EmptyPages";
import Apropos from "./Components/Apropos/Apropos";
import Artiste from "./Components/Artiste/Artiste";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import CreationArtiste from "./Components/CreationArtiste/CreationArtiste";
import PageArtiste from "./Components/PageArtiste/PageArtiste";
import CreationCollectif from "./Components/CreationCollectif/CreationCollectif";
import Collectif from "./Components/Collectif/Collectif";
import PageCollectif from "./Components/PageCollectif/PageCollectif";

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
          <Route path={"/artistes/:nom"} element={<PageArtiste />} />
          <Route path={"/collectifs"} element={<Collectif />} />
          <Route path={"/nouveaucollectif"} element={<CreationCollectif />} />
          <Route path={"/collectifs/:nom"} element={<PageCollectif />} />
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
