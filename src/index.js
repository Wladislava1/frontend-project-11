import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';

export default () => {
  const feeds = [];
  console.log(feeds);
  const linkSchema = yup.object().shape({
    url: yup.string().url().required().notOneOf(feeds),
  });

  const validateForm = (data) => linkSchema.validate(data)
    .then(() => {
      feeds.push(data);
      console.log('ok');
    })
    .catch((error) => {
      console.log('error', error.message);
    });

  const formInput = document.querySelector('.rss-form');
  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlInput = document.querySelector('input[id="url-input"]');
    const url = urlInput.value.trim();
    validateForm({ url });
  });
};
