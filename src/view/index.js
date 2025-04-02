import onChange from 'on-change';
import {
  renderErr,
  renderFeed,
  renderPosts,
  renderWindow,
} from './render.js';
import initI18n from './i18n.js';

export default function initView(state) {
  let i18nInstance;
  initI18n().then((instance) => {
    i18nInstance = instance;
  }).catch((error) => {
    console.error('Ошибка при инициализации i18n:', error);
  });

  const watchedState = onChange(state, (path) => {
    if (path === 'error') {
      renderErr(watchedState.error, i18nInstance);
    }
    if (path === 'feeds') {
      renderFeed(watchedState.feeds, i18nInstance);
    }
    if (path === 'posts' || path === 'uiState.viewedPosts') {
      renderPosts(watchedState.posts, watchedState.uiState.viewedPosts, i18nInstance);
    }
    if (path === 'viewPost.title' || path === 'viewPost.description' || path === 'viewPost.url') {
      renderWindow(watchedState.viewPost);
    }
  });

  return watchedState;
}
