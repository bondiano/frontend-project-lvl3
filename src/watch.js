// @ts-check

import onChange from 'on-change';

export default (initState, elements, i18n) => {
  const handlerByPath = {};

  return onChange(initState, (path) => {
    handlerByPath[path]?.(initState, elements, i18n);
  });
};
