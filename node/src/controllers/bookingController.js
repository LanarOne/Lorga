import { isAdmin } from "../utils/adminUtils.js";
import { BookingDAO } from "../DAOs/bookingDAO.js";

const createBooking = async (req, res) => {
  let result = null;
  try {
    const userId = parseInt(req.params.id);
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
    const { date, time, description, nbr_invite, collectifId } = req.body;
    const confirmation = false;
    if (!date || !time || !nbr_invite || !userId) {
      return res
        .status(406)
        .json({ message: `Tous les champs doivent être remplis` });
    }
    result = await BookingDAO.Create(
      date,
      time,
      description,
      nbr_invite,
      confirmation,
      collectifId,
      userId
    );
    return res
      .status(201)
      .json({ message: `Réservation passée avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const confirmBooking = async (req, res) => {
  try {
    let result = null;
    const id = parseInt(req.params.id);
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin || admin <= 5) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    const booking = await BookingDAO.ReadBookingById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ message: `Réservation inexistante ou introuvable` });
    }
    let confirmation = !booking.confirmation;
    result = await BookingDAO.Confirm(id, confirmation);
    return res
      .status(200)
      .json({ message: `Réservation confirmée avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readAllBookings = async (req, res) => {
  let result = null;
  try {
    result = await BookingDAO.ReadAllBookings();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Aucune réservation n'a été trouvée` });
    }
    return res.status(200).json({
      message: `Liste des réservations récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readConfirmedCollectifsBookings = async (req, res) => {
  let result = null;
  try {
    result = await BookingDAO.ReadConfirmedCollectifBookings();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Liste des réservations confirmées, par artiste, récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readUnconfirmed = async (req, res) => {
  let result = null;
  try {
    result = await BookingDAO.ReadUnconfirmedBookings();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Liste des réservations récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).jsont({ message: `Erreur interne`, data: error });
  }
};

const readOneBookingById = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);

    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const id = parseInt(req.params.id);
    const booking = await BookingDAO.ReadBookingById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ message: `Booking introuvable ou inexistant` });
    }
    return res
      .status(200)
      .json({ message: `Booking récupéré avec succès`, data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readBookingsByUserId = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);

    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const userId = parseInt(req.params.id);
    const bookings = await BookingDAO.ReadBookingsByUserId(userId);
    if (!bookings || !bookings.length) {
      return res
        .status(404)
        .json({ message: `Il n'y a pas de réservation pour cet utilisateur` });
    }
    return res.status(200).json({
      message: `Réservations trouvées par utilisateur`,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readBookingsByCollectifId = async (req, res) => {
  try {
    const collectifId = parseInt(req.params.id);
    const bookings = await BookingDAO.ReadBookingsByCollectifId(collectifId);
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: `Il n'y a pas de date prévu pour ce collectif` });
    }
    return res
      .status(200)
      .json({ message: `Date trouvées par collectif`, data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readBookingByDate = async (req, res) => {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1 || admin <= 4) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  try {
    const { date } = req.body;
    result = await BookingDAO.ReadBookingsByDate(date);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: `il n'y a pas d'évènements pour cette date` });
    }
    return res.status(200).json({
      message: `évènements trouvés par date avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readBookingByDateClient = async (req, res) => {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1 || admin <= 4) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);

    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const { date } = req.body;
    result = await BookingDAO.ReadBookingsByDateClient(date);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: `il n'y a pas d'évènements pour cette date` });
    }
    return res.status(200).json({
      message: `évènements trouvés par date avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const updateOneBooking = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);

    if (!admin) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    const id = parseInt(req.params.id);
    const { date, time, description, nbr_invite, collectifId } = req.body;
    if (!date || !time || !description || !nbr_invite) {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const deleteOneBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
export const BookingController = {
  createBooking,
  confirmBooking,
  readAllBookings,
  readConfirmedCollectifsBookings,
  readUnconfirmed,
  readOneBookingById,
  readBookingsByUserId,
  readBookingsByCollectifId,
  readBookingByDate,
  readBookingByDateClient,
  updateOneBooking,
  deleteOneBooking,
};
