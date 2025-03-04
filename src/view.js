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
  if (errorCode === 0 || errorCode === null) {
    errMessage.textContent = i18nInstance.t('code_zero');
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  } else if (errorCode === 1) {
    errMessage.textContent = i18nInstance.t('code_one');
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else if (errorCode === 2) {
    errMessage.textContent = i18nInstance.t('code_two');
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
  });
  return watchedState;
}

initI18n();
