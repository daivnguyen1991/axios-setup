import axios from 'axios';
import { get as lodashGet } from 'lodash';

import { removeLocalStorage, getLocalStorage, STORE_KEYS } from '@/Utils/tools';
import history from '@/History';

const APP_URL = process.env.APP_URL;

const axiosInstance = axios.create({
  baseURL: APP_URL,
});

const DEFAULT_RESULT = { code: 100, message: undefined };

// check if access token is expired and
// Force logout and redirect to login page when hit error code 401
const validateAccessToken = errorMessage => {
  if (errorMessage === 'Request failed with status code 401') {
    removeLocalStorage(STORE_KEYS.ACCESS_TOKEN);
    history.push('/login');
  }
};

const post = async (URL, data) => {
  const accessToken = getLocalStorage(STORE_KEYS.ACCESS_TOKEN, []);

  let result = DEFAULT_RESULT;
  try {
    result = await axiosInstance.post(URL, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    result = lodashGet(error, 'response.data', {});
    validateAccessToken(error.message);
  }
  return result;
};

const put = async (URL, data) => {
  const accessToken = getLocalStorage(STORE_KEYS.ACCESS_TOKEN, []);

  let result = DEFAULT_RESULT;
  try {
    result = await axiosInstance.put(URL, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    result = lodashGet(error, 'response.data', {});
    validateAccessToken(error.message);
  }
  return result;
};

const get = async (URL, params = {}) => {
  const accessToken = getLocalStorage(STORE_KEYS.ACCESS_TOKEN, []);

  let result = DEFAULT_RESULT;
  try {
    result = await axiosInstance.get(URL, {
      params,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    validateAccessToken(error.message);
  }

  return result;
};

const axiosDelete = async (URL, data = []) => {
  const accessToken = getLocalStorage(STORE_KEYS.ACCESS_TOKEN, []);
  let result = DEFAULT_RESULT;
  try {
    result = await axiosInstance.delete(URL, {
      data,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    validateAccessToken(error.message);
  }

  return result;
};

export default { get, post, put, axiosDelete };
