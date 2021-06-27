// @ts-check

import '@testing-library/jest-dom';

import path from 'path';
import fsp from 'fs/promises';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { Response } from 'miragejs';

import init from '../src/init';
// eslint-disable-next-line jest/no-mocks-import
import { startMirage } from '../__mocks__/mirage';

const corsProxyApi = 'https://hexlet-allorigins.herokuapp.com/get';
const rssUrl = 'https://ru.hexlet.io/lessons.rss';

const indexHtml = path.join(__dirname, '..', 'index.html');

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = async (filename) => {
  const fixturePath = getFixturePath(filename);

  const rss = await fsp.readFile(fixturePath, 'utf-8');
  return rss;
};

let server;

beforeEach(async () => {
  server = startMirage('test');
  const lessonsRss = await readFixture('lessons.rss');
  server.get(corsProxyApi, () => ({ contents: lessonsRss }));

  const initHtml = await fsp.readFile(indexHtml, 'utf-8');

  document.body.innerHTML = initHtml;

  await init();
});

afterEach(() => {
  server.shutdown();
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

    it('check correct rss', async () => {
      server.get(corsProxyApi, () => test);

      userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
      userEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(await screen.findByText(/Ресурс не содержит валидный RSS/i)).toBeInTheDocument();
    });

    it('check unique feed', async () => {
      userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
      userEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(await screen.findByText(/RSS успешно загружен/i)).toBeInTheDocument();

      userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
      userEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(await screen.findByText(/RSS уже существует/i)).toBeInTheDocument();
    });
  });

  describe('load feed', () => {
    it('render feeds and posts', async () => {
      userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
      userEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(await screen.findByText(/Новые уроки на Хекслете/i)).toBeInTheDocument();
      expect(await screen.findByText(/Практические уроки по программированию/i)).toBeInTheDocument();
      expect(await screen.findByRole('link', {
        name: /Production \/ DevOps: Деплой и эксплуатация/i,
      })).toBeInTheDocument();
      expect(await screen.findByRole('link', {
        name: /Docker Compose \/ DevOps: Автоматизация локального окружения/i,
      })).toBeInTheDocument();
    });
  });

  describe('network error', () => {
    it('display error message', async () => {
      server.get(corsProxyApi, () => new Response(400));

      userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
      userEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(await screen.findByText(/Ошибка сети/i)).toBeInTheDocument();
    });
  });

  describe('modal', () => {
    it('should open after click on post', async () => {
      userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
      userEvent.click(screen.getByRole('button', { name: 'add' }));

      const previewBtns = await screen.findAllByRole('button', { name: /Просмотр/i });

      expect(screen.getByRole('link', { name: /Production \/ DevOps: Деплой и эксплуатация/i })).toHaveClass('fw-bold');

      userEvent.click(previewBtns[0]);

      expect(await screen.findByText(/цель: Работа с production/i)).toBeVisible();
      expect(screen.getByRole('link', { name: /Production \/ DevOps: Деплой и эксплуатация/i })).not.toHaveClass('fw-bold');
    });
  });
});
