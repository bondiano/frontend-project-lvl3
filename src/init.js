import 'bootstrap';
import yup from 'yup';
import axios from 'axios';

import watchers from './watchers';

const FORM_STATES = {
  filling: 'filling',
};

const NETWORK_STATES = {
  idle: 'idle',
};

export default () => {
  const state = {
    form: {
      value: '',
      state: FORM_STATES.filling,
      error: null,
    },
    rss: {
      state: NETWORK_STATES.idle,
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
