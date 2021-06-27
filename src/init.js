// @ts-check

import 'bootstrap';

import i18next from 'i18next';
import * as yup from 'yup';

import runApp from './controller';
import locales from './locales';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: locales,
  }).then(() => {
    runApp(i18nextInstance);
    yup.setLocale({
      string: {
        url: 'invalidUrl',
      },
      mixed: {
        required: 'emptyField',
        notOneOf: 'alreadyExists',
      },
    });
  });
};
