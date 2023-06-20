import Photo from "../models/Photo.js";

const Create = async (nom, path, alt) => {
  let result = null;
  try {
    result = await Photo.create({ nom, path, alt });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadAllPhotos = async () => {
  let result = null;
  try {
    result = await Photo.findAll();
    return result;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadPhotoById = async (id) => {
  let result = null;
  try {
    result = await Photo.findByPk(id);
    if (!result) {
      return;
    }
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdatePhoto = async (id, data) => {
  let result = null;
  try {
    result = await Photo.findByPk(id);
    const { nom, path, alt } = data;
    if (!result) {
      return;
    }
    await Photo.update({ nom, path, alt }, { where: { id } });
    return result;
  } catch (error) {
    console.error(error.message);
    return Error(error.message);
  }
};

const DeletePhoto = async (id) => {
  let result = null;
  let message = `Photo deleted from the database`;
  try {
    result = await Photo.findByPk(id);
    if (!result) {
      return;
    }
    await result.destroy();
    return message;
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
