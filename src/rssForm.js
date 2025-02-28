import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import initView from './view.js';

export default function rssForm() {
  const state = {
    urls: [],
    error: null,
  };

  const watchedState = initView(state);

  const linkSchema = yup.object().shape({
    url: yup.string()
      .url('Ссылка должна быть валидным URL')
      .required()
      .test('unique-url', 'RSS уже существует', (value) => !watchedState.urls.includes(value)),
  });

  const validateForm = (data) => linkSchema.validate(data)
    .then(() => {
      state.urls.push(data.url);
      watchedState.error = 'RSS успешно загружен';
      console.log(watchedState.urls);
    })
    .catch((error) => {
      watchedState.error = error.message;
      console.log(error.message);
    });

  const formInput = document.querySelector('.rss-form');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlInput = document.querySelector('input[id="url-input"]');
    const url = urlInput.value.trim();
    validateForm({ url });
  });
}
