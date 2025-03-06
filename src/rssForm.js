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
    viewPost: null,
  };

  const watchedState = initView(state);

  const linkSchema = yup.object().shape({
    url: yup.string()
      .url(1)
      .required()
      .test('unique-url', 2, (value) => !state.feeds.some((item) => item.url === value)),
  });

  const getFeedsAndPosts = (errorCode, url) => {
    if (errorCode === 0) {
      fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'application/xml');
          const titleFeed = doc.querySelector('channel > title')?.textContent || 'Без названия';
          const descriptionFeed = doc.querySelector('channel > description')?.textContent || 'Без описания';
          const indexFeed = state.feeds.findIndex((item) => item.url === url);

          if (indexFeed !== -1) {
            state.feeds[indexFeed].title = titleFeed;
            state.feeds[indexFeed].description = descriptionFeed;
          }
          const postsItem = doc.querySelectorAll('item');
          const feedId = state.feeds[indexFeed].id;
          const newPosts = Array.from(postsItem).map((item) => {
            const titlePost = item.querySelector('title')?.textContent;
            const linkPost = item.querySelector('link')?.textContent;
            return {
              id: uniqid(),
              feedId,
              title: titlePost,
              url: linkPost,
            };
          });
          state.posts = [...newPosts, ...state.posts];
          watchedState.feeds = [...state.feeds];
          watchedState.posts = [...state.posts];
          console.log(state.posts);
          console.log(state.feeds);
        });
    }
  };

  const validateForm = (data) => linkSchema.validate(data)
    .then(() => {
      const idFeedPost = uniqid();
      state.feeds.push({ id: idFeedPost, url: data.url });
      state.posts.unshift({ id: uniqid(), feedId: idFeedPost });
      watchedState.error = 0;
      console.log(state.feeds);
      console.log(watchedState.error);
      getFeedsAndPosts(watchedState.error, data.url);
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

  const containerPosts = document.querySelector('.posts');
  containerPosts.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'BUTTON') {
      const link = e.target.previousElementSibling;
      if (link && link.tagName === 'A') {
        const title = link.textContent;
        watchedState.viewPost = title;
      }
    }
  });
}
