const wrongPath = async (req, res) => {
  return res.status(404).json({
    message: `L'url de la requête n'est pas valide, probablement à cause d'une mauvaise manipulation de l'utilisateur.`,
  });
};

export const wrongRoute = { wrongPath };
