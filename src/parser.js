import PROXY_URL from './config.js';

const fetchWithTimeout = (url, timeout = 10000) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('NETWORK_ERROR')), timeout);
  });

  return Promise.race([
    fetch(url),
    timeoutPromise,
  ]);
};

export const fetchRssFeed = (url) => fetchWithTimeout(`${PROXY_URL}?url=${encodeURIComponent(url)}&disableCache=true`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Ошибка: ${response.status}`);
  })
  .then((data) => {
    if (!data.contents || data.contents.trim() === '') {
      throw new Error(3);
    }
    return data;
  })
  .catch((error) => {
    if (error.message === 'NETWORK_ERROR') {
      throw new Error(4);
    }
    throw new Error(4);
  });

export const parseRssFeed = (contents) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, 'application/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error(3);
    }
    const titleFeed = doc.querySelector('channel > title')?.textContent;
    const descriptionFeed = doc.querySelector('channel > description')?.textContent;
    const postsItem = doc.querySelectorAll('item');

    const posts = Array.from(postsItem).map((item) => ({
      title: item.querySelector('title')?.textContent,
      description: item.querySelector('description')?.textContent,
      url: item.querySelector('link')?.textContent,
    }));
    return { titleFeed, descriptionFeed, posts };
  } catch (error) {
    console.error('Ошибка при парсинге RSS:', error);
    throw error;
  }
};
