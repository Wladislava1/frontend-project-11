import uniqid from 'uniqid';
import { fetchRssFeed, parseRssFeed } from './parser.js';

const intervalUpdateFeeds = (state, watchedState) => {
  if (watchedState.error === 0) {
    const updatedState = { ...state, posts: [...state.posts] };
    const updatedWatchedState = { ...watchedState, posts: [...watchedState.posts] };

    const feedPromises = state.feeds.map((feed) => fetchRssFeed(feed.url)
      .then((data) => {
        const { posts } = parseRssFeed(data.contents);
        const newPosts = posts.map((post) => ({
          id: uniqid(),
          feedId: feed.id,
          ...post,
        }));

        const existingPostUrls = new Set(updatedState.posts.map((post) => post.url));
        const uniquePosts = newPosts.filter((post) => !existingPostUrls.has(post.url));

        if (uniquePosts.length > 0) {
          updatedState.posts = [...uniquePosts, ...updatedState.posts];
          updatedWatchedState.posts = [...updatedState.posts];
        }
      })
      .catch((error) => console.error('Ошибка обновления фидов:', error)));

    Promise.all(feedPromises).finally(() => {
      state.posts = updatedState.posts;
      watchedState.posts = updatedWatchedState.posts;

      setTimeout(() => intervalUpdateFeeds(state, watchedState), 5000);
    });
  }
};

export default intervalUpdateFeeds;
