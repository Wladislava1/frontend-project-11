import './styles.scss';
import 'bootstrap';
import initView from './view/index.js';
import getSchema from './shema.js';
import { createPost, initialState, createFeed } from './state.js';
import { fetchRssFeed, parseRssFeed } from './parser.js';
import intervalUpdateFeeds from './intervalUpdatesFeeds.js';

export default function rssForm() {
  const state = initialState;
  const watchedState = initView(state);
  const linkSchema = getSchema(watchedState);

  const getFeedsAndPosts = (url) => fetchRssFeed(url)
    .then((data) => {
      const { titleFeed, descriptionFeed, posts } = parseRssFeed(data.contents);
      const existingFeed = state.feeds.find((feed) => feed.url === url);

      if (existingFeed) {
        existingFeed.title = titleFeed;
        existingFeed.description = descriptionFeed;
      } else {
        const newFeed = createFeed(url, titleFeed, descriptionFeed);
        state.feeds.push(newFeed);
        state.posts.unshift(createPost(newFeed.id));
      }
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
      console.log(error.message);
    });

  const validateForm = (data) => linkSchema.validate(data)
    .catch((error) => {
      watchedState.error = error.message;
      console.log(error.message);
    });

  const formInput = document.querySelector('.rss-form');
  const buttonSubmit = formInput.querySelector('button');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    buttonSubmit.disabled = true;
    const urlInput = document.querySelector('input[id="url-input"]');
    const url = urlInput.value.trim();
    validateForm({ url })
      .then(() => {
        getFeedsAndPosts(url);
      })
      .finally(() => {
        buttonSubmit.disabled = false;
        urlInput.value = '';
      });
  });

  const containerPosts = document.querySelector('.posts');
  containerPosts.addEventListener('click', (e) => {
    const post = e.target.closest('li');
    if (!post) return;

    const link = post.querySelector('a');
    if (!link) return;

    const indexPost = state.posts.findIndex((item) => item.url === link.getAttribute('href'));
    if (indexPost !== -1) {
      state.posts[indexPost].show = false;
    }
    if (e.target.classList.contains('btn-sm')) {
      watchedState.viewPost.title = state.posts[indexPost].title;
      watchedState.viewPost.description = state.posts[indexPost].description;
      watchedState.viewPost.url = link.getAttribute('href');
    }
    watchedState.posts = [...state.posts];
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
