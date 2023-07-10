import { API_URL } from "../constants/constants";

async function Request(url, config) {
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
  const hasError = !result || status >= 400;
  return {
    status,
    result: hasError ? null : result,
    error: hasError ? `Result is null ${error || ""}` : null,
  };
}

async function getRequest(url, token = null) {
  const config = {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };
  if (token) config.headers.Authorization = token;

  return await Request(url, config);
}

async function postRequest(url, body = {}, token = null) {
  const config = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };
  if (token) config.headers.Authorization = token;
  return await Request(url, config);
}

export { getRequest, postRequest };
