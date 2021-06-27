// @ts-check

import onChange from 'on-change';
import { NETWORK_STATE } from './constants';

const handleForm = (state, elements, i18n) => {
  const { form: { valid, error } } = state;
  const { input, feedback } = elements;
  if (valid) {
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18n.t([`feedbackMessage.${error}`, 'feedbackMessage.unknownError']);
  }
};

const handleRSSStatus = (state, elements, i18n) => {
  const { rss } = state;
  const { submit, input, feedback } = elements;

  switch (rss.status) {
    case NETWORK_STATE.FAILED:
      submit.disabled = false;
      input.removeAttribute('readonly');
      feedback.classList.add('text-danger');
      feedback.textContent = i18n.t([`feedbackMessage.${rss.error}`, 'feedbackMessage.unknown']);
      break;
    case NETWORK_STATE.IDLE:
      submit.disabled = false;
      input.removeAttribute('readonly');
      input.value = '';
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('loading.success');

      input.focus();
      break;
    case NETWORK_STATE.LOADING:
      submit.disabled = true;
      input.setAttribute('readonly', true);
      feedback.classList.remove('text-success');
      feedback.classList.remove('text-danger');
      feedback.innerHTML = '';
      break;
    default:
      throw new Error(`Unknown rss status: '${rss.status}'`);
  }
};

const handleFeeds = (state, elements, i18n) => {
  const { feeds } = state;
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');
  cardWrapper.innerHTML = `
      <div class='card-body'></div>
    `;

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18n.t('feeds');
  feedsContainer.appendChild(feedsTitle);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'rounded-0');
  feedsTitle.after(feedsList);

  const feedsListItems = feeds.map((feed) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    listItem.append(title);

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;
    listItem.append(title, description);

    return listItem;
  });

  feedsList.append(...feedsListItems);
  cardWrapper.appendChild(feedsList);
  feedsContainer.appendChild(cardWrapper);
};

const handlePosts = (state, elements, i18n) => {
  const { posts, ui } = state;
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');
  cardWrapper.innerHTML = `
      <div class='card-body'></div>
    `;

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18n.t('posts');
  postsContainer.appendChild(postsTitle);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const postsListItems = posts.map((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    link.setAttribute('href', post.link);
    const className = ui.readPosts.has(post.id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
    link.classList.add(...className);
    link.dataset.id = post.id;
    link.textContent = post.title || i18n.t('emptyTitle');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    postItem.appendChild(link);

    const modalButton = document.createElement('button');
    modalButton.setAttribute('type', 'button');
    modalButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    modalButton.setAttribute('data-id', `${post.id}`);
    modalButton.setAttribute('data-bs-toggle', 'modal');
    modalButton.setAttribute('data-bs-target', '#modal');
    modalButton.textContent = i18n.t('preview');
    postItem.appendChild(modalButton);

    return postItem;
  });

  postsList.append(...postsListItems);
  cardWrapper.appendChild(postsList);
  postsContainer.appendChild(cardWrapper);
};

const handleModal = (state, elements) => {
  const post = state.posts.find(({ id }) => id === state.modal.postId);
  const title = elements.modal.querySelector('.modal-title');
  const body = elements.modal.querySelector('.modal-body');
  const fullArticleBtn = elements.modal.querySelector('.full-article');

  title.textContent = post.title;
  body.textContent = post.description;
  fullArticleBtn.href = post.link;
};

export default (initState, elements, i18n) => {
  const handlerByPath = {
    form: handleForm,
    'rss.status': handleRSSStatus,
    feeds: handleFeeds,
    posts: handlePosts,
    'modal.postId': handleModal,
    'ui.readPosts': handlePosts,
  };

  return onChange(initState, (path) => {
    handlerByPath[path]?.(initState, elements, i18n);
  });
};
