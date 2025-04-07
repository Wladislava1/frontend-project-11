/* eslint-disable no-param-reassign */
import './styles.scss';
import 'bootstrap';
import initView from './view/index.js';
import getSchema from './shema.js';
import { createPost, initialState, createFeed } from './state.js';
import parseRssFeed from './parser.js';
import fetchRssFeed from './fetch.js';
import intervalUpdateFeeds from './intervalUpdatesFeeds.js';

const getFeedsAndPosts = (url, watchedState, state) => {
  watchedState.addingFeedProcess = {
    ...watchedState.addingFeedProcess,
    state: 'processing',
  };
  return fetchRssFeed(url)
    .then((data) => {
      const { titleFeed, descriptionFeed, posts } = parseRssFeed(data.contents);
      const existingFeed = state.feeds.find((feed) => feed.url === url);
      console.log(`existingFeed: ${existingFeed}`);

      if (existingFeed) {
        existingFeed.title = titleFeed;
        existingFeed.description = descriptionFeed;
      } else {
        const newFeed = createFeed(url, titleFeed, descriptionFeed);
        watchedState.feeds = [...state.feeds, newFeed];
        watchedState.posts = [createPost(newFeed.id), ...state.posts];
      }
      console.log(`state.feeds: ${state.feeds}`);
      const feedId = state.feeds.find((feed) => feed.url === url).id;
      const newPosts = posts.map((post) => createPost(
        feedId,
        post.title,
        post.description,
        post.url,
      ));
      watchedState.posts = [...newPosts, ...state.posts];
      watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'success' };
      intervalUpdateFeeds(state, watchedState);
    })
    .catch((error) => {
      watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'failed', error: error.message };
    });
};

const validateForm = (data, watchedState) => {
  const linkSchema = getSchema(watchedState);
  return linkSchema.validate(data)
    .then(() => true)
    .catch((error) => {
      watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'failed', error: error.message };
      return false;
    });
};

const handleFormSubmit = (e, urlInput, watchedState, state) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  validateForm({ url }, watchedState)
    .then((isValid) => {
      if (!isValid) return;
      watchedState.addingFeedProcess = { ...watchedState.addingFeedProcess, state: 'processing' };
      getFeedsAndPosts(url, watchedState, state);
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
}
