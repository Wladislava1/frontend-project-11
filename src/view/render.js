import { createContainerFeedsOrPosts } from './renderUtils.js';

export const renderErr = (stateAddingFeed, i18nInstance) => {
  const input = document.querySelector('input[id="url-input"]');
  const errMessage = document.querySelector('.feedback');
  errMessage.textContent = '';
  errMessage.classList.remove('text-success');
  errMessage.classList.remove('text-danger');
  const code = parseInt(stateAddingFeed.error, 10);
  if (stateAddingFeed.state === 'success') {
    errMessage.textContent = i18nInstance.t('code_zero');
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  } else if (stateAddingFeed.state === 'failed') {
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

export const renderInput = (stateAddingFeed) => {
  const formInput = document.querySelector('.rss-form');
  const buttonSubmit = formInput.querySelector('button');
  const input = document.querySelector('input[id="url-input"]');
  if (stateAddingFeed.state === 'filling') {
    buttonSubmit.disabled = false;
  } else if (stateAddingFeed.state === 'processing') {
    buttonSubmit.disabled = true;
  } else if (stateAddingFeed.state === 'success') {
    buttonSubmit.disabled = false;
    input.value = '';
  } else if (stateAddingFeed.state === 'failed') {
    buttonSubmit.disabled = false;
    input.value = '';
  }
};

export const renderFeed = (feeds, i18nInstance) => {
  createContainerFeedsOrPosts(feeds, i18nInstance, 'feeds');
};

export const renderPosts = (posts, viewedPosts, i18nInstance) => {
  console.log('Рендеринг постов:', posts);
  createContainerFeedsOrPosts(posts, i18nInstance, 'posts', viewedPosts);
};

export const renderWindow = (uiState) => {
  const body = document.querySelector('body');
  const containerShow = body.querySelector('.fade');
  const link = containerShow.querySelector('.full-article');
  const textBreak = containerShow.querySelector('.text-break');

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
  const isOpen = uiState.modalWindow === 'shown';
  if (isOpen) {
    body.style.overflow = 'hidden';
    body.style.paddingRight = '17px';
    containerShow.classList.add('show');
    containerShow.style.display = 'block';
    containerShow.setAttribute('aria-modal', true);
  } else {
    textBreak.textContent = '';
  }
  const lastViewedPost = uiState.viewedPosts[uiState.viewedPosts.length - 1];
  console.log(`последний элемент: ${lastViewedPost}`);
  if (lastViewedPost) {
    if (lastViewedPost.title) {
      titleModal.textContent = lastViewedPost.title;
    }
    if (lastViewedPost.description) {
      descriptionModal.textContent = lastViewedPost.description;
    }
    if (lastViewedPost.url) {
      link.setAttribute('href', lastViewedPost.url);
    }
  }
};
