/* eslint-disable no-param-reassign */
import uniqid from 'uniqid';
import parseRssFeed from './parser.js';

const fetchWithTimeout = (url, timeout = 10000) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('NETWORK_ERROR')), timeout);
  });

  return Promise.race([
    fetch(url),
    timeoutPromise,
  ]);
};

export const fetchRssFeed = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', 'true');
  return fetchWithTimeout(proxyUrl.toString())
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Ошибка: ${response.status}`);
    })
    .catch((error) => {
      if (error.message === 'NETWORK_ERROR') {
        throw new Error(4);
      }
      throw new Error(4);
    });
};

export const intervalUpdateFeeds = (state, watchedState) => {
  const feedPromises = state.feeds.map((feed) => fetchRssFeed(feed.url)
    .then((data) => {
      const { posts } = parseRssFeed(data.contents);

      const newPosts = posts.map((post) => ({
        id: uniqid(),
        feedId: feed.id,
        ...post,
      }));

      const existingPostUrls = new Set(state.posts.map((post) => post.url));
      const uniquePosts = newPosts.filter((post) => !existingPostUrls.has(post.url));

      if (uniquePosts.length > 0) {
        state.posts = [...uniquePosts, ...state.posts];
        watchedState.posts = [...state.posts];
      }
    })
    .catch((error) => {
      console.error('Ошибка обновления фидов:', error);
    }));

  Promise.all(feedPromises).then(() => {
  }).finally(() => {
    setTimeout(() => intervalUpdateFeeds(state, watchedState), 5000);
  });
};
