import 'bootstrap';
import yup from 'yup';
import axios from 'axios';

import watchers from './watchers';

export default () => {
  const state = {
    form: {
      value: '',
      state: 'filling',
      error: null,
    },
    rss: {
      state: 'idle',
      error: null,
    },
    feeds: [],
    posts: [],
  };

  const elements = {
    input: document.getElementById('inputRSS'),
    form: document.getElementById('formRSS'),
    feed: document.getElementById('feed'),
  };

  watchers(state, elements);
};
