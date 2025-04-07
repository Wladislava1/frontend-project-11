import * as Yup from 'yup';

const getSchema = (state) => {
  const urlsFeed = state.feeds.map((feed) => feed.url);

  return Yup.object().shape({
    url: Yup.string()
      .url(1)
      .required()
      .notOneOf(urlsFeed, 2),
  });
};
export default getSchema;
