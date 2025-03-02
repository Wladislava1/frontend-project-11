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
      .url(1)
      .required()
      .test('unique-url', 2, (value) => !state.urls.includes(value)),
  });

  const validateForm = (data) => linkSchema.validate(data)
    .then(() => {
      state.urls.push(data.url);
      watchedState.error = 0;
      console.log(state.urls);
      console.log(watchedState.error);
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
