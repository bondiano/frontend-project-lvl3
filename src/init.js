// @ts-check

import 'bootstrap';

import i18next from 'i18next';

import { FORM_STATES, NETWORK_STATES } from './states';
import runApp from './controller';
import locales from './locales';

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

  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: locales,
  }).then(() => {
    runApp(state, i18nextInstance);
  });
};
