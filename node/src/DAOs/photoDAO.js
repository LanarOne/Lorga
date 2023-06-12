import Photo from "../models/Photo.js";

const Create = async (nom, path, alt) => {
  try {
    const photo = await Photo.create({ nom, path, alt });
    return photo;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadAllPhotos = async () => {
  try {
    const photos = await Photo.findAll();
    return photos;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadPhotoById = async (id) => {
  try {
    const photo = await Photo.findByPk(id);
    if (!photo) {
      return null;
    }
    return photo;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdatePhoto = async (id, data) => {
  try {
    const photo = await Photo.findByPk(id);
    const { nom, path, alt } = data;
    if (!photo) {
      return null;
    }
    await Photo.update({ nom, path, alt }, { where: { id } });
    return photo;
  } catch (error) {
    console.error(error.message);
    return Error(error.message);
  }
};

const DeletePhoto = async (id) => {
  try {
    const photo = await Photo.findByPk(id);
    if (!photo) {
      return null;
    }
    await photo.destroy();
    return `Photo deleted from the database`;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

export const PhotoDAO = {
  Create,
  ReadPhotoById,
  ReadAllPhotos,
  UpdatePhoto,
  DeletePhoto,
};
