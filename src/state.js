import uniqid from 'uniqid';

export const initialState = {
  addingFeedProcess: {
    state: 'filling',
    // filling – ввод данных в поле.
    // processing – отправка формы, блокировка кнопки и поля.
    // success – успешная регистрация, кнопка отключается.
    // failed – ошибка валидации, отображается сообщение.
    error: null,
  },
  feeds: [], // id, url, title, description
  posts: [], // id, feedId, title, description, url
  uiState: {
    viewedPosts: [], // title description url visibility
    modalWindow: 'hidden',
  },
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
