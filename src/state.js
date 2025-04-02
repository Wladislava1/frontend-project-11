import uniqid from 'uniqid';

export const initialState = {
  feeds: [], // id, url, title, description
  posts: [], // id, feedId, title, description, url
  viewPost: {
    title: null,
    description: null,
    url: null,
  },
  uiState: {
    viewedPosts: [],
  },
  error: null,
};

export const createFeed = (url, titleFeed, descriptionFeed) => ({
  id: uniqid(),
  url,
  title: titleFeed,
  description: descriptionFeed,
});

export const createPost = (feedId, title, description, url) => ({
  id: uniqid(),
  feedId,
  title,
  description,
  url,
  show: true,
});
