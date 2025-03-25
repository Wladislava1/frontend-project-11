import * as Yup from 'yup';
import PROXY_URL from './config.js';
import { parseRssFeed } from './parser.js';

const getSchema = (state) => Yup.object().shape({
  url: Yup.string()
    .url(1)
    .required()
    .test('unique-url', 2, (value) => !state.feeds.some((item) => item.url === value))
    .test('network-error', 4, (value) => fetch(`${PROXY_URL}?url=${encodeURIComponent(value)}&_cache=false`)
      .then((response) => {
        console.log('Ответ прокси:', response);
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.text();
      })
      .catch((error) => {
        console.log('Ошибка в network-error:', error.message);
        if (
          error.message.includes('fetch')
          || error.message.includes('NetworkError')
          || error.message.includes('Failed to fetch')
        ) {
          console.log('Ошибка связи');
        } else {
          console.log(`Возникла ошибка: ${error}`);
        }
        throw error;
      }))
    .test('rss-valid', 3, (value) => new Promise((resolve) => {
      fetch(`${PROXY_URL}?url=${encodeURIComponent(value)}&_cache=false`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const text = data.contents;
          if (!text.trim()) {
            console.log('Получены пустые данные');
            resolve(false);
            return;
          }
          parseRssFeed(text);
          resolve(true);
        })
        .catch((error) => {
          console.log(`Ошибка при проверке RSS: ${error}`);
          resolve(false);
        });
    })),
});

export default getSchema;
