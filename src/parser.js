const parseRssFeed = (contents) => {
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

export default parseRssFeed;
