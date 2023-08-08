import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const PageCollectif = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { nom } = useParams();
  return <div></div>;
};

export default PageCollectif;
