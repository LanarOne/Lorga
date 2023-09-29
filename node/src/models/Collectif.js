import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Photo from "./Photo.js";
import Lien from "./Lien.js";
import Artiste from "./Artiste.js";
import Artiste_Collectif from "./Artiste_Collectif.js";
import Booking from "./Booking.js";

const Collectif = sequelize.define(
  "collectif",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    influences: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    style: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    confirmation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

export default Collectif;
