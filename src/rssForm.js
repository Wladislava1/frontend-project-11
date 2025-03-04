import './styles.scss';
import 'bootstrap';
import uniqid from 'uniqid';
import * as yup from 'yup';
import initView from './view.js';

export default function rssForm() {
  const state = {
    feeds: [], // id url title description
    posts: [],
    error: null,
  };

  const watchedState = initView(state);

  const linkSchema = yup.object().shape({
    url: yup.string()
      .url(1)
      .required()
      .test('unique-url', 2, (value) => !state.feeds.some((item) => item.url === value)),
  });

  const functionResponse = (errorCode, validUrl) => {
    if (errorCode === 0) {
      fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(validUrl)}`)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'application/xml');
          const title = doc.querySelector('channel > title')?.textContent || 'Без названия';
          const description = doc.querySelector('channel > description')?.textContent || 'Без описания';
          const index = state.feeds.findIndex((item) => item.url === validUrl);
          if (index !== -1) {
            state.feeds[index].title = title;
            state.feeds[index].description = description;
            const updateFeeds = [...state.feeds];
            watchedState.feeds = updateFeeds;
          }
        });
    }
  };

  const validateForm = (data) => linkSchema.validate(data)
    .then(() => {
      state.feeds.push({ id: uniqid(), url: data.url });
      watchedState.error = 0;
      console.log(state.feeds);
      console.log(watchedState.error);
      functionResponse(watchedState.error, data.url);
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
