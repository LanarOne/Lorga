import React, { useEffect, useState } from "react";
import mc from "./booking.module.scss";
import { DatePicker } from "@gsebdev/react-simple-datepicker";
import Button from "../smallElts/Button/Button";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getCollectifId,
  getDate,
  getDescription,
  getNbrInvite,
  getTime,
  getUserId,
  postNewBooking,
} from "../../Redux/Reducers/booking.slice";
import { getCollectifByCreateur } from "../../Redux/Reducers/createCollectif.slice";
import Modale from "../smallElts/Modale/Modale";
const Booking = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user);
  const { date, time, description, nbr_invite, collectifId, userId } =
    useSelector((state) => state.booking);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isCollectifAdmin, setIsCollectifAdmin] = useState(false);
  if (!token) {
    window.location.href = "/login";
  }

  const toggleModale = () => {
    setIsOpen(!isOpen);
  };
  const clickedDate = (e) => {
    const [month, day, year] = e.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    setNewDate(formattedDate);
  };
  const clickedTime = (e) => {
    const formattedTime = `${e}:00`;
    setNewTime(formattedTime);
  };
  useEffect(() => {
    const dispatchDatas = async () => {
      if (newDate) {
        await dispatch(getDate(newDate));
      }
      if (newTime) {
        await dispatch(getTime(newTime));
      }
    };
    dispatchDatas();
  }, [newDate, newTime]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let error;
    let status;

    try {
      const body = { date, time, description, nbr_invite, collectifId };
      const response = await dispatch(postNewBooking({ body, token, userId }));
      status = response.payload.status;
      error = response.payload.error;
      if (status <= 201) {
        window.location.href = "/";
      }
      if (status >= 400 || error) {
        console.log(response);
        let { message } = response.payload;
        setMessage(message);
        toggleModale();
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  useEffect(() => {
    const getUserDatas = async () => {
      let error;
      let status;
      if (user) {
        await dispatch(getUserId(user.userId));
        if (user.collectifs.length > 0) {
          const response = await dispatch(
            getCollectifByCreateur({ userId, token })
          );
          status = response.payload.status;
          if (status <= 201) {
            const collectifId = response.payload.result.data.id;
            await dispatch(getCollectifId(collectifId));
            setIsCollectifAdmin(true);
          }
          if (status >= 400) {
            if (status === 400 || !error) {
              return;
            }
            error = response.payload.error;
            let { message } = error;
            setMessage(message);
            toggleModale();
          }
        }
      }
    };
    getUserDatas();
  }, [user]);
  return (
    <div>
      <>
        {isOpen ? (
          <Modale message={message} setModaleOpen={toggleModale} />
        ) : null}
      </>
      <Header />
      <main>
        {isCollectifAdmin ? (
          <form
            action="datebooking"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="date">Date de la soirée : </label>
              <DatePicker
                onChange={(e) => {
                  clickedDate(e.target.value);
                }}
                id={`${mc.datepicker}`}
                name={"date"}
              />
            </div>
            <div>
              <label htmlFor="time">L'heure du set : </label>
              <input
                type="time"
                onChange={(e) => {
                  clickedTime(e.target.value);
                }}
                min={"20:00"}
                max={"00:00"}
              />
            </div>
            <div>
              <label htmlFor="description">Description de la soirée : </label>
              <input
                type="text"
                onChange={(e) => {
                  dispatch(getDescription(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="nbr_invite">Nombre d'artistes présents : </label>
              <input
                type="number"
                onChange={(e) => {
                  dispatch(getNbrInvite(e.target.value));
                }}
              />
            </div>
            <Button message={`Valider`} />
          </form>
        ) : (
          <form
            action="datebooking"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="date">Date de la réservation : </label>
              <DatePicker
                onChange={(e) => {
                  clickedDate(e.target.value);
                }}
                id={`${mc.datepicker}`}
                name={"date"}
              />
            </div>
            <div>
              <label htmlFor="time">Heure de réservation : </label>
              <input
                type="time"
                onChange={(e) => {
                  clickedTime(e.target.value);
                }}
                min={"20:00"}
                max={"00:00"}
              />
            </div>
            <div>
              <label htmlFor="description">
                Endroit que tu souhaites réserver :{" "}
              </label>
              <input
                type="text"
                onChange={(e) => {
                  dispatch(getDescription(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="nbr_invite">Le nombre d'invités : </label>
              <input
                type="number"
                onChange={(e) => {
                  dispatch(getNbrInvite(e.target.value));
                }}
              />
            </div>
            <Button message={`Valider`} />
          </form>
        )}
      </main>
    </div>
  );
};

export default Booking;
