import { createContainerFeedsOrPosts } from './renderUtils.js';

export const renderErr = (errorCode, i18nInstance) => {
  const input = document.querySelector('input[id="url-input"]');
  const errMessage = document.querySelector('.feedback');
  errMessage.textContent = '';
  errMessage.classList.remove('text-success');
  errMessage.classList.remove('text-danger');
  const code = parseInt(errorCode, 10);
  if (code === 0 || code === null) {
    errMessage.textContent = i18nInstance.t('code_zero');
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  } else {
    if (code === 1) {
      errMessage.textContent = i18nInstance.t('code_one');
    } else if (code === 2) {
      errMessage.textContent = i18nInstance.t('code_two');
    } else if (code === 3) {
      errMessage.textContent = i18nInstance.t('code_tree');
    } else if (code === 4) {
      errMessage.textContent = i18nInstance.t('code_four');
    }
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  }
};

export const renderFeed = (feeds, i18nInstance) => {
  createContainerFeedsOrPosts(feeds, i18nInstance, 'feeds');
};

export const renderPosts = (posts, viewedPosts, i18nInstance) => {
  createContainerFeedsOrPosts(posts, i18nInstance, 'posts', viewedPosts);
};

export const renderWindow = (viewPost) => {
  const body = document.querySelector('body');
  const containerShow = body.querySelector('.fade');
  const link = containerShow.querySelector('.full-article');

  body.style.overflow = '';
  body.style.paddingRight = '';
  containerShow.classList.remove('show');
  containerShow.style.display = '';
  containerShow.removeAttribute('aria-modal');
  link.setAttribute('href', '#');
  const titleModal = containerShow.querySelector('.modal-title');
  titleModal.textContent = '';
  const descriptionModal = containerShow.querySelector('.text-break');
  descriptionModal.textContent = '';

  if (viewPost.title || viewPost.description || viewPost.url) {
    body.style.overflow = 'hidden';
    body.style.paddingRight = '17px';
    containerShow.classList.add('show');
    containerShow.style.display = 'block';
    containerShow.setAttribute('aria-modal', true);
  }
  if (viewPost.title) {
    titleModal.textContent = viewPost.title;
  }
  if (viewPost.description) {
    descriptionModal.textContent = viewPost.description;
  }
  if (viewPost.url) {
    link.setAttribute('href', viewPost.url);
  }
};
