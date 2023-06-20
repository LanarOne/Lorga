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

const readAllBookings = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const bookings = await BookingDAO.ReadAllBookings();
  if (!bookings) {
    return res
      .status(404)
      .json({ message: `Aucune réservation n'a été trouvée` });
  }
  return res.status(200).json({
    message: `Liste des réservations récupérée avec succès`,
    data: bookings,
  });
};

const readOneBookingById = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);

  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const id = req.params.id;
  const booking = await BookingDAO.ReadBookingById(id);
  if (!booking) {
    return res
      .status(404)
      .json({ message: `Booking introuvable ou inexistant` });
  }
  return res
    .status(200)
    .json({ message: `Booking récupéré avec succès`, data: booking });
};

const readBookingsByUserId = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);

  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const userId = req.params.id;
  const bookings = await BookingDAO.ReadBookingsByUserId(userId);
  if (!bookings || !bookings.length) {
    return res
      .status(404)
      .json({ message: `Il n'y a pas de réservation pour cet utilisateur` });
  }
  return res
    .status(200)
    .json({ message: `Réservations trouvées par utilisateur`, data: bookings });
};

const readBookingsByCollectifId = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);

  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const collectifId = req.params.id;
  const bookings = await BookingDAO.ReadBookingsByCollectifId(collectifId);
  if (bookings.length === 0) {
    return res
      .status(404)
      .json({ message: `Il n'y a pas de date prévu pour ce collectif` });
  }
  return res
    .status(200)
    .json({ message: `Date trouvées par collectif`, data: bookings });
};

const updateOneBooking = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);

  if (!admin) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  const id = req.params.id;
  const { date, time, description, nbr_invite, collectifId } = req.body;
  console.log(date, time, description, nbr_invite, collectifId);
  if (!date || !time || !description || !nbr_invite || !collectifId) {
    return res
      .status(400)
      .json({ message: `Tous les champs doivent être remplis` });
  }
  const data = { date, time, description, nbr_invite, collectifId };
  const booking = await BookingDAO.UpdateOneBooking(id, data);
  if (!booking) {
    return res.status(404).json({ message: `Réservation introuvable` });
  }
  return res
    .status(200)
    .json({ message: `Réservation mis à jour avec succès`, data: booking });
};

const deleteOneBooking = async (req, res) => {
  const id = req.params.id;
  const existingBooking = await BookingDAO.ReadBookingById(id);
  if (!existingBooking) {
    return res
      .status(404)
      .json({ message: `Booking introuvable ou inexistant` });
  }
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  const booking = await BookingDAO.DeleteOneBooking(id);
  return res.status(200).json({
    message: `La réservation a été supprimé de la base de données avec succès`,
    data: booking,
  });
};
export const BookingController = {
  createBooking,
  confirmBooking,
  readAllBookings,
  readOneBookingById,
  readBookingsByUserId,
  readBookingsByCollectifId,
  updateOneBooking,
  deleteOneBooking,
};
