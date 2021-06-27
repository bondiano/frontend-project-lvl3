// @ts-check

import axios from 'axios';
import * as yup from 'yup';

export const validateUrl = (url, urls) => {
  const urlSchema = yup
    .string()
    .trim()
    .url()
    .required()
    .notOneOf(urls);

  try {
    urlSchema.validateSync(url);
    return null;
  } catch (error) {
    return error.message;
  }
};

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

export const sendRequest = (url) => {
  const urlWithProxy = addProxy(url);
  return axios.get(urlWithProxy, { timeout: 10000 }).then((response) => {
    const { data } = response;
    return data.contents;
  });
};
