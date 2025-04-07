/* eslint-disable no-param-reassign */
import uniqid from 'uniqid';
import parseRssFeed from './parser.js';
import fetchRssFeed from './fetch.js';

const intervalUpdateFeeds = (state, watchedState) => {
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
      } else {
        console.log('Нет новых постов');
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

export default intervalUpdateFeeds;
