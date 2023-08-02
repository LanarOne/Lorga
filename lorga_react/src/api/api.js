import { API_URL } from "../constants/constants";

async function Request(url, config) {
  let status = -1;
  let error = null;
  let result = null;

  try {
    const response = await fetch(`${API_URL}${url}`, config);
    status = response.status;
    if (status <= 201) {
      result = await response.json();
      return result;
    }
    if (status >= 400) {
      error = await response.json();
    }
  } catch (e) {
    error = e.message;
  } finally {
    return handleResponse(result, status, error);
  }
}

async function requestFile(url, config) {
  let status = -1;
  let error = null;
  let result = null;
  try {
    const response = await fetch(`${API_URL}${url}`, config);
    status = response.status;
    result = await response.json();
  } catch (e) {
    error = e.message;
  } finally {
    return handleResponse(result, status, error);
  }
}

function handleResponse(result, status, error) {
  try {
    const hasError = !result || status >= 400;
    return {
      status: status,
      result: hasError ? result : result,
      error: hasError ? error : null,
    };
  } catch (e) {
    console.error(e.message);
  }
}

async function getRequest(url, token = null) {
  const config = {
    method: "GET",
    headers: { "Content-type": "application/json;" },
  };
  if (token) config.headers.Authorization = token;

  return await Request(url, config);
}

async function postRequest(url, body = {}, token = null) {
  const config = {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(body),
  };
  if (token) config.headers.Authorization = token;
  return await Request(url, config);
}

async function postFileRequest(url, formData = {}, token = null) {
  const config = {
    method: "POST",
    body: formData,
    headers: {
      // "Content-Type": "multipart/form-data",
      // Authorization: `${token}`,
    },
  };
  if (token) config.headers.Authorization = token;
  return await requestFile(url, config);
}

export { getRequest, postRequest, postFileRequest };
