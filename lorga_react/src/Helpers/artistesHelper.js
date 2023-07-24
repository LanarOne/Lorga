import { getRequest } from "../api/api";
import { GET_ARTISTES } from "../constants/constants";

export const getAllArtistes = async () => {
  let result = null;
  try {
    result = await getRequest(GET_ARTISTES);
    let error = result.error;
    let message = result.result.message;
    return result.result.data;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
