import Admin_collectif from "./Admin_collectif.js";
import Artiste from "./Artiste.js";
import Artiste_Collectif from "./Artiste_Collectif.js";
import Boisson from "./Boisson.js";
import Booking from "./Booking.js";
import Collectif from "./Collectif.js";
import Lien from "./Lien.js";
import Photo from "./Photo.js";
import Role from "./Role.js";
import Setlist from "./Setlist.js";
import User from "./User.js";
function applyAssociation(sequelize) {
  Artiste.hasMany(Lien, {
    foreignKey: { allowNull: true, name: "artisteId" },
    sourceKey: "id",
  });
  Collectif.hasMany(Booking, {
    foreignKey: { allowNull: true, name: "collectifId" },
    sourceKey: "id",
  });
  Artiste.belongsToMany(Booking, { through: Setlist });
  Collectif.belongsToMany(Artiste, { through: Artiste_Collectif });

  Collectif.hasMany(Lien, {
    foreignKey: { allowNull: true, name: "collectifId" },
    sourceKey: "id",
  });
  Photo.hasOne(Collectif, {
    foreignKey: { allowNull: false, name: "photoId", unique: true },
    sourceKey: "id",
  });
  Photo.hasMany(Boisson, {
    foreignKey: { allowNull: false, name: "photoId" },
    sourceKey: "id",
  });
  Photo.hasOne(Artiste, {
    foreignKey: { allowNull: false, name: "photoId", unique: true },
    sourceKey: "id",
  });
  User.hasMany(Booking, {
    foreignKey: { allowNull: false, name: "userId" },
    sourceKey: "id",
  });
  User.hasOne(Artiste, {
    foreignKey: {
      allowNull: false,
      name: "userId",
      unique: { message: `Utilisateur déjà lié à un compte artiste` },
    },
    sourceKey: "id",
  });
  Role.hasMany(User, {
    foreignKey: { allowNull: false, name: "roleId" },
    sourceKey: "id",
  });
  User.belongsToMany(Collectif, { through: Admin_collectif });
}

export { applyAssociation };
