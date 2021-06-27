// @ts-check

import { createServer } from 'miragejs';

// eslint-disable-next-line import/prefer-default-export
export function startMirage(environment = 'development') {
  return createServer({
    environment,
  });
}
