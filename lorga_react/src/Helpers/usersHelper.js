import { getRequest } from "../api/api";
import { GET_USER } from "../constants/constants";
export const getUser = async (token) => {
  try {
    const response = await getRequest(GET_USER, token);
    const data = response.result;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
