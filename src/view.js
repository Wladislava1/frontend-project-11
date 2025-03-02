import onChange from 'on-change';
import i18next from 'i18next';
import ru from './language/ru.js';
import en from './language/en.js';

const renderErr = (errorCode, i18nInstance) => {
  const input = document.querySelector('input[id="url-input"]');
  const errMessage = document.querySelector('.feedback');
  errMessage.textContent = '';
  errMessage.classList.remove('text-success');
  errMessage.classList.remove('text-danger');
  if (errorCode === 0 || errorCode === null) {
    errMessage.textContent = i18nInstance.t('code_zero');
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  } else if (errorCode === 1) {
    errMessage.textContent = i18nInstance.t('code_one');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (errorCode === 2) {
    errMessage.textContent = i18nInstance.t('code_two');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  }
};

let i18nInstance;

const initI18n = () => new Promise((resolve, reject) => {
  i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: { translation: ru.translation },
      en: { translation: en.translation },
    },
  })
    .then(() => {
      resolve(i18nInstance);
    })
    .catch((error) => {
      reject(error);
    });
});

export default function initView(state) {
  const watchedState = onChange(state, (path) => {
    if (path === 'error') {
      renderErr(watchedState.error, i18nInstance);
    }
  });
  return watchedState;
}

initI18n();
