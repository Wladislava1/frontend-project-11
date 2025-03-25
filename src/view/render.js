import { createFeedItem, createPostItem } from './renderUtils.js';

export const renderErr = (errorCode, i18nInstance) => {
  const input = document.querySelector('input[id="url-input"]');
  const errMessage = document.querySelector('.feedback');
  errMessage.textContent = '';
  errMessage.classList.remove('text-success');
  errMessage.classList.remove('text-danger');
  const code = Number(errorCode);
  if (code === 0 || code === null) {
    errMessage.textContent = i18nInstance.t('code_zero');
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  } else if (code === 1) {
    errMessage.textContent = i18nInstance.t('code_one');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (code === 2) {
    errMessage.textContent = i18nInstance.t('code_two');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (code === 3) {
    errMessage.textContent = i18nInstance.t('code_tree');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (code === 4) {
    errMessage.textContent = i18nInstance.t('code_four');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  }
};

export const renderFeed = (feeds, i18nInstance) => {
  console.log('renderFeed вызван');
  const feedContainer = document.querySelector('.feeds');
  console.log(feedContainer);
  feedContainer.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const titleFeeds = document.createElement('h2');
  titleFeeds.classList.add('card-title', 'h4');
  titleFeeds.textContent = i18nInstance.t('feeds');
  cardBody.appendChild(titleFeeds);

  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const feedItem = createFeedItem(feed);
    listFeeds.appendChild(feedItem);
  });

  cardBody.appendChild(listFeeds);
  card.appendChild(cardBody);
  feedContainer.appendChild(card);
};

export const renderPosts = (posts, i18nInstance) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const titlePosts = document.createElement('h2');
  titlePosts.classList.add('card-title', 'h4');
  titlePosts.textContent = i18nInstance.t('posts');
  cardBody.appendChild(titlePosts);
  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const postItem = createPostItem(post);
    if (postItem !== null) {
      listPosts.appendChild(postItem);
    }
  });

  cardBody.appendChild(listPosts);
  card.appendChild(cardBody);
  postsContainer.appendChild(card);
};

export const renderWindow = (viewPost) => {
  console.log('вызван renderWindow');
  const body = document.querySelector('body');
  const containerShow = body.querySelector('.fade');

  body.style.overflow = '';
  body.style.paddingRight = '';
  containerShow.classList.remove('show');
  containerShow.style.display = '';

  if (viewPost.title !== null) {
    body.style.overflow = 'hidden';
    body.style.paddingRight = '17px';
    containerShow.classList.add('show');
    containerShow.style.display = 'block';
    containerShow.setAttribute('aria-modal', true);

    const titleModal = containerShow.querySelector('.modal-title');
    titleModal.textContent = viewPost.title;
  }
  if (viewPost.description !== null) {
    body.style.overflow = 'hidden';
    body.style.paddingRight = '17px';
    containerShow.classList.add('show');
    containerShow.style.display = 'block';
    containerShow.setAttribute('aria-modal', true);

    const descriptionModal = containerShow.querySelector('.text-break');
    descriptionModal.textContent = viewPost.description;
  }
};
