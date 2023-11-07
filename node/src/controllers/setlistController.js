import { isAdmin } from "../utils/adminUtils.js";
import { SetlistDAO } from "../DAOs/setlistDAO.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import { BookingDAO } from "../DAOs/bookingDAO.js";

const createSetlist = async (req, res) => {
  try {
    const artisteId = parseInt(req.params.id);
    const token = decodeURIComponent(req.headers.authorization);
    if (!token) {
      return res
        .status(401)
        .json({ message: `Veuillez vous enregistrer ou vous connecter` });
    }
    const admin = await isAdmin(token);
    if (!admin || admin <= 2) {
      return res
        .status(403)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    const { bookingId } = req.body;
    if (!bookingId || !artisteId) {
      return res.status(406).json({ message: `Il manque des information` });
    }
    const existingEntry = await SetlistDAO.alreadyExist(artisteId, bookingId);
    if (existingEntry) {
      return res.status(400).json({
        message: `Artiste déjà présent dans la setlist`,
        data: existingEntry,
      });
    }
    if (!existingEntry) {
      const setlist = await SetlistDAO.Create(artisteId, bookingId);
      return res.status(201).json({
        message: `Artiste correctement ajouté à la setlist`,
        data: setlist,
      });
    }
    if (!setlist) {
      return res
        .status(500)
        .json({ message: `Erreur pendant l'ajout à la setlist` });
    }
  } catch (e) {
    return res.status(500).json({ message: `Erreur interne`, data: e });
  }
};

const readSetlistById = async (req, res) => {
  let result;
  try {
    const id = parseInt(req.params.id);
    result = await SetlistDAO.ReadById(id);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Setlist inexistante`, data: result });
    }
    return res
      .status(200)
      .json({ message: `Artiste trouvé dans la setlist`, data: result });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: `Erreur interne`, data: e });
  }
};
const readSetlistByBookingId = async (req, res) => {
  let result;
  try {
    const bookingId = parseInt(req.params.id);
    result = await SetlistDAO.ReadByBookingId(bookingId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Setlist inexistante`, data: result });
    }
    const artistesOnSetlist = [];
    for (const entry of result) {
      const artisteId = entry.artisteId;
      const response = await ArtisteDAO.ReadById(artisteId);
      const artiste = {
        id: response.id,
        nom: response.nom,
        description: response.description,
        influences: response.influences,
        style: response.style,
        photoId: response.photoId,
        setlistId: entry.id,
      };
      artistesOnSetlist.push(artiste);
    }
    return res
      .status(200)
      .json({ message: `Artistes dans la setlist`, data: artistesOnSetlist });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: `Erreur interne`, data: e });
  }
};

const readSetlistByArtisteId = async (req, res) => {
  let result;
  try {
    const artisteId = parseInt(req.params.id);
    console.log(artisteId);
    result = await SetlistDAO.ReadByArtisteId(artisteId);
    console.log(result, `controller`);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Setlist inexistante`, data: result });
    }
    const bookingOfArtiste = [];
    for (const entry of result) {
      const bookingId = entry.bookingId;
      const booking = await BookingDAO.ReadBookingById(bookingId);
      bookingOfArtiste.push(booking);
    }
    return res
      .status(200)
      .json({ message: `Artistes dans la setlist`, data: bookingOfArtiste });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: `Erreur interne`, data: e });
  }
};

const deleteSetlist = async (req, res) => {
  // const token = decodeURIComponent(req.headers.authorization);
  // if (!token) {
  //   return res
  //     .status(401)
  //     .json({ message: `Veuillez vous enregistrer ou vous connecter` });
  // }
  // const admin = await isAdmin(token);
  // if (!admin || admin <= 2) {
  //   return res
  //     .status(403)
  //     .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  // }
  try {
    const id = parseInt(req.params.id);
    const destroy = await SetlistDAO.DeleteOne(id);
    return res
      .status(200)
      .json({ message: `Artiste supprimé de la setlist`, data: destroy });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: `Erreur interne`, data: e });
  }
};
export const SetlistController = {
  createSetlist,
  readSetlistById,
  readSetlistByArtisteId,
  readSetlistByBookingId,
  deleteSetlist,
};
