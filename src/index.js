import './styles.scss';
import 'bootstrap';
import initView from './view/index.js';
import getSchema from './shema.js';
import { createPost, initialState, createFeed } from './state.js';
import { fetchRssFeed, parseRssFeed } from './parser.js';
import intervalUpdateFeeds from './intervalUpdatesFeeds.js';

const getFeedsAndPosts = (url, state, watchedState) => fetchRssFeed(url)
  .then((data) => {
    const { titleFeed, descriptionFeed, posts } = parseRssFeed(data.contents);
    const indexFeed = state.feeds.findIndex((item) => item.url === url);

    const updatedFeeds = indexFeed !== -1
      ? state.feeds.map((item, index) => (index === indexFeed
        ? { ...item, title: titleFeed, description: descriptionFeed }
        : item))
      : state.feeds;

    const newPosts = indexFeed !== -1
      ? posts.map((post) => createPost(
        state.feeds[indexFeed].id,
        post.title,
        post.description,
        post.url,
      ))
      : [];

    return {
      ...watchedState,
      feeds: updatedFeeds,
      posts: [...newPosts, ...state.posts],
      error: 0,
    };
  })
  .catch((error) => ({
    ...watchedState,
    error: error.message,
  }));

const validateForm = (data, state, watchedState, linkSchema) => linkSchema.validate(data)
  .then(() => {
    const newFeed = createFeed(data.url);
    const updatedFeeds = [...state.feeds, newFeed];
    const updatedPosts = [createPost(newFeed.id), ...state.posts];

    return getFeedsAndPosts(data.url, state, {
      ...watchedState,
      feeds: updatedFeeds,
      posts: updatedPosts,
    }).then((newWatchedState) => {
      intervalUpdateFeeds(state, newWatchedState);
      return newWatchedState;
    });
  })
  .catch((error) => ({
    ...watchedState,
    error: error.message,
  }));

const handleSubmit = (e, state, watchedState, linkSchema) => {
  e.preventDefault();
  const buttonSubmit = e.target.querySelector('button');
  buttonSubmit.disabled = true;
  const urlInput = e.target.querySelector('input[id="url-input"]');
  const url = urlInput.value.trim();

  validateForm({ url }, state, watchedState, linkSchema).finally(() => {
    buttonSubmit.disabled = false;
    urlInput.value = '';
  });
};

const handlePostClick = (e, state, watchedState) => {
  const post = e.target.closest('li');
  if (!post) return watchedState;

  const link = post.querySelector('a');
  if (!link) return watchedState;

  const indexPost = state.posts.findIndex((item) => item.url === link.getAttribute('href'));
  if (indexPost !== -1) {
    const updatedPosts = state.posts.map((item, index) => (
      index === indexPost ? { ...item, show: false } : item));

    if (e.target.classList.contains('btn-sm')) {
      return {
        ...watchedState,
        viewPost: {
          title: state.posts[indexPost].title,
          description: state.posts[indexPost].description,
          url: link.getAttribute('href'),
        },
        posts: updatedPosts,
      };
    }

    return {
      ...watchedState,
      posts: updatedPosts,
    };
  }

  return watchedState;
};

const handleCloseModal = (e) => {
  e.preventDefault();
  document.querySelector('.text-break').textContent = '';
};

export default function rssForm() {
  const state = initialState;
  const watchedState = initView(state);
  const linkSchema = getSchema(watchedState);

  document.querySelector('.rss-form').addEventListener('submit', (e) => handleSubmit(e, state, watchedState, linkSchema));
  document.querySelector('.posts').addEventListener('click', (e) => handlePostClick(e, state, watchedState));
  document.querySelector('.close').addEventListener('click', handleCloseModal);
  document.querySelector('.btn-secondary').addEventListener('click', handleCloseModal);
}
