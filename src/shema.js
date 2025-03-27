import * as Yup from 'yup';

const getSchema = (state) => Yup.object().shape({
  url: Yup.string()
    .url(1)
    .required()
    .test('unique-url', 2, (value) => !state.feeds.some((item) => item.url === value)),
});

export default getSchema;
