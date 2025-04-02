import './styles.scss';
import 'bootstrap';
import initView from './view/index.js';
import getSchema from './shema.js';
import { createPost, initialState, createFeed } from './state.js';
import parseRssFeed from './parser.js';
import fetchRssFeed from './fetchUtils.js';
import intervalUpdateFeeds from './intervalUpdatesFeeds.js';

export default function rssForm() {
  const state = initialState;
  const watchedState = initView(state);
  const linkSchema = getSchema(watchedState);

  const getFeedsAndPosts = (url) => fetchRssFeed(url)
    .then((data) => {
      const { titleFeed, descriptionFeed, posts } = parseRssFeed(data.contents);
      const existingFeed = state.feeds.find((feed) => feed.url === url);
      console.log(existingFeed);

      if (existingFeed) {
        existingFeed.title = titleFeed;
        existingFeed.description = descriptionFeed;
      } else {
        const newFeed = createFeed(url, titleFeed, descriptionFeed);
        state.feeds = [...state.feeds, newFeed];
        state.posts = [createPost(newFeed.id), ...state.posts];
      }
      console.log(state.feeds);
      const feedId = state.feeds.find((feed) => feed.url === url).id;
      const newPosts = posts.map((post) => createPost(
        feedId,
        post.title,
        post.description,
        post.url,
      ));

      state.posts = [...newPosts, ...state.posts];
      watchedState.feeds = [...state.feeds];
      watchedState.posts = [...state.posts];
      watchedState.error = 0;
      intervalUpdateFeeds(state, watchedState);
    })
    .catch((error) => {
      watchedState.error = error.message;
      throw error;
    });

  const validateForm = (data) => linkSchema.validate(data)
    .then(() => true)
    .catch((error) => {
      watchedState.error = error.message;
      return false;
    });

  const formInput = document.querySelector('.rss-form');
  const buttonSubmit = formInput.querySelector('button');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    buttonSubmit.disabled = true;
    const urlInput = document.querySelector('input[id="url-input"]');
    const url = urlInput.value.trim();
    validateForm({ url })
      .then((isValid) => {
        if (!isValid) return;
        getFeedsAndPosts(url)
          .finally(() => {
            buttonSubmit.disabled = false;
          });
        urlInput.value = '';
      });
  });

  const containerPosts = document.querySelector('.posts');
  containerPosts.addEventListener('click', (e) => {
    const post = e.target.closest('li');
    if (!post) return;

    const link = post.querySelector('a');
    if (!link) return;

    const postUrl = link.getAttribute('href');
    const foundPost = state.posts.find((item) => item.url === postUrl);
    console.log(`foundPost = ${foundPost}`);
    if (foundPost) {
      const isViewed = state.uiState.viewedPosts.some((viewedPost) => viewedPost.url === postUrl);
      if (!isViewed) {
        state.uiState.viewedPosts = [...state.uiState.viewedPosts, { url: foundPost.url, visibility: 'hidden' }];
      }
    }
    if (e.target.classList.contains('btn-sm')) {
      watchedState.viewPost.title = foundPost.title;
      watchedState.viewPost.description = foundPost.description;
      watchedState.viewPost.url = link.getAttribute('href');
    }
    watchedState.uiState.viewedPosts = [...state.uiState.viewedPosts];
  });

  const containerShow = document.querySelector('.fade');
  const textBreak = containerShow.querySelector('.text-break');
  const closeModalButtonText = containerShow.querySelector('.close');
  const closeModalButtonKrest = containerShow.querySelector('.btn-secondary');
  closeModalButtonText.addEventListener('click', (e) => {
    e.preventDefault();
    textBreak.textContent = '';
  });
  closeModalButtonKrest.addEventListener('click', (e) => {
    e.preventDefault();
    textBreak.textContent = '';
  });
}
