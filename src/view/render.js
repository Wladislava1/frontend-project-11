import { createFeedsOrPosts } from './renderUtils.js';

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
  createFeedsOrPosts(feeds, i18nInstance, 'feeds');
};

export const renderPosts = (posts, i18nInstance) => {
  createFeedsOrPosts(posts, i18nInstance, 'posts');
};

export const renderWindow = (viewPost) => {
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
