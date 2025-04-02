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

const fetchRssFeed = (url) => fetchWithTimeout(`${PROXY_URL}?url=${encodeURIComponent(url)}&disableCache=true`)
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

export default fetchRssFeed;
