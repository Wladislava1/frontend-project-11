import uniqid from 'uniqid';

export const initialState = {
  feeds: [], // id, url, title, description
  posts: [], // id, feedId, title, description, url, show
  viewPost: {
    title: null,
    description: null,
  },
  error: null,
};

export const createFeed = (url) => ({
  id: uniqid(),
  url,
  title: null,
  description: null,
});

export const createPost = (feedId, title, description, url) => ({
  id: uniqid(),
  feedId,
  title,
  description,
  url,
  show: true,
});
