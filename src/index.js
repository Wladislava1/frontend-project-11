/* eslint-disable no-param-reassign */
import './styles.scss';
import 'bootstrap';
import initView from './view/index.js';
import getSchema from './shema.js';
import { createPost, initialState, createFeed } from './state.js';
import parseRssFeed from './parser.js';
import fetchRssFeed from './fetch.js';
import intervalUpdateFeeds from './intervalUpdatesFeeds.js';

const validateForm = (data, watchedState) => {
  const linkSchema = getSchema(watchedState);
  return linkSchema.validate(data)
    .then(() => ({ isValid: true, validationError: null }))
    .catch((validationError) => ({ isValid: false, validationError }));
};

const handleFormSubmit = (e, urlInput, watchedState, state) => {
  e.preventDefault();
  watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'processing' };
  const url = urlInput.value.trim();
  validateForm({ url }, watchedState)
    .then(({ isValid, validationError }) => {
      if (!isValid) {
        watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'failed', error: validationError.message };
        return;
      }
      fetchRssFeed(url)
        .then((data) => {
          const { titleFeed, descriptionFeed, posts } = parseRssFeed(data.contents);
          const existingFeed = state.feeds.find((feed) => feed.url === url);

          const currentFeed = existingFeed
            ? { ...existingFeed, title: titleFeed, description: descriptionFeed }
            : createFeed(url, titleFeed, descriptionFeed);

          if (!existingFeed) {
            watchedState.feeds = [...state.feeds, currentFeed];
            watchedState.posts = [createPost(currentFeed.id), ...state.posts];
          }

          const newPosts = posts.map((post) => createPost(
            currentFeed.id,
            post.title,
            post.description,
            post.url,
          ));

          watchedState.posts = [...newPosts, ...state.posts];
          watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'success' };
        })
        .catch((error) => {
          watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'failed', error: error.message };
        });
    });
};

const handlePostClick = (e, state, watchedState) => {
  const post = e.target.closest('li');
  if (!post) return;

  const link = post.querySelector('a');
  if (!link) return;

  const postUrl = link.getAttribute('href');
  const foundPost = state.posts.find((item) => item.url === postUrl);
  if (foundPost) {
    const isViewed = state.uiState.viewedPosts.some((viewedPost) => viewedPost.url === postUrl);
    if (!isViewed) {
      watchedState.uiState.viewedPosts = [...watchedState.uiState.viewedPosts, {
        url: foundPost.url,
        title: foundPost.title,
        description: foundPost.description,
        visibility: 'hidden',
      }];
    }
  }
  if (e.target.classList.contains('btn-sm')) {
    watchedState.uiState.modalWindow = 'shown';
    watchedState.uiState = { ...watchedState.uiState };
  }
};

const handleCloseModal = (watchedState) => {
  watchedState.uiState.modalWindow = 'hidden';
  watchedState.uiState = { ...watchedState.uiState };
};

export default function rssForm() {
  const state = initialState;
  const watchedState = initView(state);

  const formInput = document.querySelector('.rss-form');
  const urlInput = document.querySelector('input[id="url-input"]');
  const containerPosts = document.querySelector('.posts');
  const containerShow = document.querySelector('.fade');
  const closeModalButtonText = containerShow.querySelector('.close');
  const closeModalButtonKrest = containerShow.querySelector('.btn-secondary');

  formInput.addEventListener('submit', (e) => handleFormSubmit(
    e,
    urlInput,
    watchedState,
    state,
  ));

  containerPosts.addEventListener('click', (e) => handlePostClick(e, state, watchedState));
  closeModalButtonText.addEventListener('click', (e) => {
    e.preventDefault();
    handleCloseModal(watchedState);
  });
  closeModalButtonKrest.addEventListener('click', (e) => {
    e.preventDefault();
    handleCloseModal(watchedState);
  });
  intervalUpdateFeeds(state, watchedState);
}
