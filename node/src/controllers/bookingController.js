import { isAdmin } from "../utils/adminUtils.js";
import { BookingDAO } from "../DAOs/bookingDAO.js";

const createBooking = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: `Veuillez vous enregistrer` });
  }
  const admin = await isAdmin(token);
  if (!admin) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  try {
    const { date, time, description, nbr_invite, collectifId } = req.body;
    if (!date || !time || !nbr_invite || !userId) {
      return res
        .status(406)
        .json({ message: `Tous les champs doivent être remplis` });
    }
    const booking = await BookingDAO.Create(
      date,
      time,
      description,
      nbr_invite,
      collectifId,
      userId
    );
    return res
      .status(201)
      .json({ message: `Réservation passée avec succès`, data: booking });
  } catch (error) {
    return Error(error.message);
  }
};

const confirmBooking = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin <= 3) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  const confirmation = req.body;
  const booking = await BookingDAO.Confirm(id, confirmation);
  if (!booking) {
    return res
      .status(404)
      .json({ message: `Réservation inexistante ou introuvable` });
  }
  return res
    .status(200)
    .json({ message: `Réservation confirmée avec succès`, data: booking });
};
export const BookingController = { createBooking, confirmBooking };
