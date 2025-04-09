import onChange from 'on-change';
import i18next from 'i18next';
import {
  renderErr,
  renderFeed,
  renderInput,
  renderPosts,
  renderWindow,
} from './render.js';
import ru from '../language/ru.js';
import en from '../language/en.js';

export default function initView(state) {
  const i18nInstance = i18next.createInstance();
  return i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: { translation: ru.translation },
      en: { translation: en.translation },
    },
  }).then(() => {
    const watchedState = onChange(state, (path) => {
      if (path === 'addingFeedProcess') {
        renderErr(watchedState.addingFeedProcess, i18nInstance);
        renderInput(watchedState.addingFeedProcess);
      }
      if (path === 'feeds') {
        renderFeed(watchedState.feeds, i18nInstance);
      }
      if (path === 'posts' || path === 'uiState.viewedPosts') {
        renderPosts(watchedState.posts, watchedState.uiState.viewedPosts, i18nInstance);
      }
      if (path === 'uiState.modalWindow') {
        renderWindow(watchedState.uiState, i18nInstance);
      }
    });

    return watchedState;
  }).catch((error) => {
    console.error('Ошибка при инициализации i18n:', error);
    throw error;
  });
}
