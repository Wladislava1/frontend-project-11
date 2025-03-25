import i18next from 'i18next';
import ru from '../language/ru.js';
import en from '../language/en.js';

const initI18n = () => new Promise((resolve, reject) => {
  const i18nInstance = i18next.createInstance();
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

export default initI18n;
