import uniqid from 'uniqid';
import parseRssFeed from './parser.js';
import fetchRssFeed from './fetch.js';

const intervalUpdateFeeds = (state, watchedState) => {
  console.log('Вызов обновления');
  console.log('Текущее состояние watchedState:', watchedState);
  console.log('Текущее состояние state:', state);

  if (watchedState.addingFeedProcess.state === 'success') {
    console.log('Процесс добавления фидов успешен, обновляем посты');
    const updatedState = { ...state, posts: [...state.posts] };
    const updatedWatchedState = { ...watchedState, posts: [...watchedState.posts] };

    console.log('Созданы обновленные состояния:', updatedState, updatedWatchedState);

    const feedPromises = state.feeds.map((feed) => {
      console.log('Обновляем фид:', feed.url);
      return fetchRssFeed(feed.url)
        .then((data) => {
          console.log('Получены данные для фида:', feed.url);
          const { posts } = parseRssFeed(data.contents);
          console.log('Парсинг постов:', posts);

          const newPosts = posts.map((post) => ({
            id: uniqid(),
            feedId: feed.id,
            ...post,
          }));

          console.log('Созданы новые посты:', newPosts);

          const existingPostUrls = new Set(updatedState.posts.map((post) => post.url));
          const uniquePosts = newPosts.filter((post) => !existingPostUrls.has(post.url));

          console.log('Уникальные посты:', uniquePosts);

          if (uniquePosts.length > 0) {
            console.log('Добавлены новые посты:', uniquePosts);
            updatedState.posts = [...uniquePosts, ...updatedState.posts];
            updatedWatchedState.posts = [...updatedState.posts];
          } else {
            console.log('Нет новых постов');
          }
        })
        .catch((error) => {
          console.error('Ошибка обновления фидов:', error);
        });
    });

    Promise.all(feedPromises).then(() => {
      console.log('Все промисы выполнены');
      console.log('Обновленные состояния после промисов:', updatedState, updatedWatchedState);
    }).finally(() => {
      console.log('Обновляем состояния');
      Object.assign(state, updatedState);
      Object.assign(watchedState, updatedWatchedState);
      console.log('Состояния обновлены:', state, watchedState);
      setTimeout(() => intervalUpdateFeeds(updatedState, updatedWatchedState), 5000);
    });
  } else {
    console.log('Процесс добавления фидов не успешен');
  }
};

export default intervalUpdateFeeds;
