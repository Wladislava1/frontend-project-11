import i18next from 'i18next';
import ru from '../language/ru.js';
import en from '../language/en.js';

const initI18n = () => {
  const i18nInstance = i18next.createInstance();
  return i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: { translation: ru.translation },
      en: { translation: en.translation },
    },
  }).then(() => i18nInstance);
};

export default initI18n;
