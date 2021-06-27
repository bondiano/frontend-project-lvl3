// @ts-check

import _ from 'lodash';

import parse from './parseRSS';
import watch from './watch';

import { NETWORK_STATE } from './constants';
import { sendRequest, validateUrl } from './utils';

const FETCHING_TIMEOUT = 5000;

const getLoadingProcessErrorType = (error) => {
  if (error.isParsingError) {
    return 'noRss';
  }
  if (error.isAxiosError) {
    return 'network';
  }
  return 'unknown';
};

const fetchNewPosts = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => sendRequest(feed.url).then((contents) => {
    const feedData = parse(contents);
    const newPosts = feedData.items.map((item) => ({ ...item, feedId: feed.id }));
    const oldPosts = watchedState.posts.filter((post) => post.feedId === feed.id);

    const posts = _.differenceBy(newPosts, oldPosts, 'title').map((post) => ({ ...post, id: _.uniqueId() }));

    watchedState.posts.posts = posts;
  }).catch(console.error));

  Promise.all(promises).finally(() => {
    setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT);
  });
};

const loadRss = (watchedState, url) => {
  watchedState.rss.status = NETWORK_STATE.LOADING;
  return sendRequest(url).then((contents) => {
    const data = parse(contents);
    const feed = {
      url, id: _.uniqueId(), title: data.title, description: data.description,
    };

    const posts = data.items.map((item) => ({ ...item, feedId: feed.id, id: _.uniqueId() }));

    watchedState.posts.unshift(...posts);
    watchedState.feeds.unshift(feed);

    watchedState.rss.error = null;
    watchedState.rss.status = NETWORK_STATE.IDLE;
    watchedState.form = {
      error: null,
      valid: true,
    };
  }).catch((e) => {
    console.error(e);
    watchedState.rss.error = getLoadingProcessErrorType(e);
    watchedState.rss.status = NETWORK_STATE.FAILED;
  });
};

export default (i18nextInstance) => {
  const state = {
    form: {
      error: null,
      valid: false,
    },
    rss: {
      state: NETWORK_STATE.idle,
      error: null,
    },
    feeds: [],
    posts: [],
    modal: {
      postId: null,
    },
    ui: {
      readPosts: new Set(),
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-form input'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
    modal: document.querySelector('#modal'),
  };

  const watchedState = watch(state, elements, i18nextInstance);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = data.get('url');
    const feedUrls = watchedState.feeds.map((feed) => feed.url);
    const error = validateUrl(url, feedUrls);

    if (error) {
      watchedState.form = {
        valid: false,
        error,
      };
    } else {
      watchedState.form = {
        valid: true,
        error: null,
      };
      loadRss(watchedState, url);
    }
  });

  elements.postsContainer.addEventListener('click', (event) => {
    if (!('id' in event.target.dataset)) {
      return;
    }

    const { id } = event.target.dataset;
    watchedState.modal.postId = String(id);
    watchedState.ui.readPosts.add(id);
  });

  setTimeout(() => fetchNewPosts(watchedState), FETCHING_TIMEOUT);
};
