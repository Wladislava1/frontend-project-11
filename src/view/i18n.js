import i18next from 'i18next';
import ru from '../language/ru.js';
import en from '../language/en.js';

const initI18n = () => i18next.createInstance().init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: { translation: ru.translation },
    en: { translation: en.translation },
  },
}).catch((error) => {
  console.error('Ошибка инициализации i18next:', error);
});

export default initI18n;
