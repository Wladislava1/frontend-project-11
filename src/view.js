import onChange from 'on-change';
import i18next from 'i18next';
import ru from './language/ru.js';
import en from './language/en.js';

const renderErr = (errorCode, i18nInstance) => {
  const input = document.querySelector('input[id="url-input"]');
  const errMessage = document.querySelector('.feedback');
  errMessage.textContent = '';
  errMessage.classList.remove('text-success');
  errMessage.classList.remove('text-danger');
  const code = Number(errorCode);
  if (code === 0 || code === null) {
    errMessage.textContent = i18nInstance.t('code_zero');
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  } else if (code === 1) {
    errMessage.textContent = i18nInstance.t('code_one');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (code === 2) {
    errMessage.textContent = i18nInstance.t('code_two');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (code === 3) {
    errMessage.textContent = i18nInstance.t('code_tree');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (code === 4) {
    errMessage.textContent = i18nInstance.t('code_four');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  }
};

const createFeedItem = (feed) => {
  const elInListFeeds = document.createElement('li');
  elInListFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
  const titleFeed = document.createElement('h3');
  titleFeed.classList.add('h6', 'm-0');
  titleFeed.textContent = feed.title;
  const descriptionFeed = document.createElement('p');
  descriptionFeed.classList.add('m-0', 'small', 'text-black-50');
  descriptionFeed.textContent = feed.description;
  elInListFeeds.append(titleFeed, descriptionFeed);
  return elInListFeeds;
};

const createPostItem = (post) => {
  const elInListPosts = document.createElement('li');
  elInListPosts.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const linkForPost = document.createElement('a');
  linkForPost.href = post.url;
  linkForPost.classList.add('fw-bold');
  if (post.show === false) {
    linkForPost.classList.remove('fw-bold');
    linkForPost.classList.add('fw-normal');
    linkForPost.classList.add('link-secondary');
  }
  linkForPost.setAttribute('data-id', post.id);
  linkForPost.setAttribute('target', '_blank');
  linkForPost.setAttribute('rel', 'noopener noreferrer');
  linkForPost.textContent = post.title;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';
  elInListPosts.appendChild(linkForPost);
  elInListPosts.appendChild(button);
  return elInListPosts;
};

const renderFeed = (feeds, i18nInstance) => {
  console.log('renderFeed вызван');
  const feedContainer = document.querySelector('.feeds');
  console.log(feedContainer);
  feedContainer.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const titleFeeds = document.createElement('h2');
  titleFeeds.classList.add('card-title', 'h4');
  titleFeeds.textContent = i18nInstance.t('feeds');
  cardBody.appendChild(titleFeeds);

  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const feedItem = createFeedItem(feed);
    listFeeds.appendChild(feedItem);
  });

  cardBody.appendChild(listFeeds);
  card.appendChild(cardBody);
  feedContainer.appendChild(card);
};

const renderPosts = (posts, i18nInstance) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const titlePosts = document.createElement('h2');
  titlePosts.classList.add('card-title', 'h4');
  titlePosts.textContent = i18nInstance.t('posts');
  cardBody.appendChild(titlePosts);
  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const postItem = createPostItem(post);
    listPosts.appendChild(postItem);
  });

  cardBody.appendChild(listPosts);
  card.appendChild(cardBody);
  postsContainer.appendChild(card);
};

const renderWindow = (viewPost) => {
  console.log('вызван renderWindow');
  const body = document.querySelector('body');
  const containerShow = body.querySelector('.fade');

  body.style.overflow = '';
  body.style.paddingRight = '';
  containerShow.classList.remove('show');
  containerShow.style.display = '';

  if (viewPost.title !== null) {
    body.style.overflow = 'hidden';
    body.style.paddingRight = '17px';
    containerShow.classList.add('show');
    containerShow.style.display = 'block';
    containerShow.setAttribute('aria-modal', true);

    const titleModal = containerShow.querySelector('.modal-title');
    titleModal.textContent = viewPost.title;
  }
  if (viewPost.description !== null) {
    body.style.overflow = 'hidden';
    body.style.paddingRight = '17px';
    containerShow.classList.add('show');
    containerShow.style.display = 'block';
    containerShow.setAttribute('aria-modal', true);

    const descriptionModal = containerShow.querySelector('.text-break');
    descriptionModal.textContent = viewPost.description;
  }
};

let i18nInstance;

const initI18n = () => new Promise((resolve, reject) => {
  i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: { translation: ru.translation },
      en: { translation: en.translation },
    },
  })
    .then(() => {
      resolve(i18nInstance);
    })
    .catch((error) => {
      reject(error);
    });
});

export default function initView(state) {
  const watchedState = onChange(state, (path) => {
    if (path === 'error') {
      console.log('onChange вызван для пути:', path);
      renderErr(watchedState.error, i18nInstance);
    }
    if (path === 'feeds') {
      console.log('onChange вызван для пути:', path);
      renderFeed(watchedState.feeds, i18nInstance);
    }
    if (path === 'posts') {
      console.log('onChange вызван для пути:', path);
      renderPosts(watchedState.posts, i18nInstance);
    }
    if (path === 'viewPost.title' || path === 'viewPost.description') {
      console.log('onChange вызван для пути:', path);
      renderWindow(watchedState.viewPost);
    }
  });
  return watchedState;
}

initI18n();
