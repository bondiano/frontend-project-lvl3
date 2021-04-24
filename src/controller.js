// @ts-check

import yup from 'yup';
import axios from 'axios';

import parse from './parseRSS';
import watch from './watch';

export default (state, i18nextInstance) => {
  const elements = {
    input: document.getElementById('inputRSS'),
    form: document.getElementById('formRSS'),
    feed: document.getElementById('feed'),
  };

  const watchedState = watch(elements, state, i18nextInstance);
};
