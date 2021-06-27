// @ts-check

import '@testing-library/jest-dom';

import path from 'path';
import fsp from 'fs/promises';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

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

  describe('validation', () => {
    it('check valid url', async () => {
      userEvent.type(screen.getByRole('textbox', { name: 'url' }), 'test');
      userEvent.click(screen.getByRole('button', { name: 'add' }));
      expect(await screen.findByText(/Ссылка должна быть валидным URL/i)).toBeInTheDocument();
    });

    it.todo('check correct rss');

    it.todo('check unique feed');
  });

  describe('load feed', () => {
    it.todo('render feeds and posts');

    it.todo('disable ui elements during loading');
  });

  describe('network error', () => {
    it.todo('display error message');
  });

  describe('modal', () => {
    it.todo('should open after click on post');
  });
});
