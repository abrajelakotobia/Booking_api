import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

// CREATE: Créez une nouvelle chambre et liez-la à un hôtel
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();

    // Associez la nouvelle chambre à l'hôtel
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });

    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

// UPDATE: Mettez à jour les informations d'une chambre
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

// UPDATE: Mettez à jour la disponibilité d'une chambre
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Le statut de la chambre a été mis à jour.");
  } catch (err) {
    next(err);
  }
};

// DELETE: Supprimez une chambre et retirez-la de l'hôtel
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    // Supprimez la chambre
    await Room.findByIdAndDelete(req.params.id);

    // Retirez la chambre de l'hôtel
    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: req.params.id },
    });

    res.status(200).json("La chambre a été supprimée.");
  } catch (err) {
    next(err);
  }
};

// GET: Obtenez les détails d'une chambre
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

// GET ALL: Obtenez la liste de toutes les chambres
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

