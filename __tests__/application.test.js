// @ts-check

import '@testing-library/jest-dom';

import path from 'path';
import fsp from 'fs/promises';
import { screen } from '@testing-library/dom';

import init from '../src/init';

const indexHtml = path.join(__dirname, '..', 'index.html');

beforeEach(async () => {
  const initHtml = await fsp.readFile(indexHtml, 'utf-8');

  document.body.innerHTML = initHtml;

  await init();
});

describe('RSS aggregator', () => {
  it('should be correct on start', () => {
    const submitButton = screen.getByRole('button', { name: 'add' });
    const rssUrlField = screen.getByRole('textbox', { name: 'url' });

    expect(submitButton).toBeInTheDocument();
    expect(rssUrlField).toBeInTheDocument();
  });
});
