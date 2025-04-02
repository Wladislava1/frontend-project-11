export const createFeedItem = (feed) => {
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

export const createPostItem = (post, viewedPosts) => {
  if (!post.url || !post.title) {
    return null;
  }
  const elInListPosts = document.createElement('li');
  elInListPosts.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const linkForPost = document.createElement('a');
  linkForPost.href = post.url;
  linkForPost.classList.add('fw-bold');
  const isViewed = viewedPosts.some((viewedPost) => viewedPost.url === post.url && viewedPost.visibility === 'hidden');
  if (isViewed) {
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

export const createContainerFeedsOrPosts = (
  elements,
  i18nInstance,
  elementCreated,
  viewedPosts = [],
) => {
  const elementContainer = document.querySelector(`.${elementCreated}`);
  elementContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const titleElement = document.createElement('h2');
  titleElement.classList.add('card-title', 'h4');
  titleElement.textContent = i18nInstance.t(elementCreated);
  cardBody.appendChild(titleElement);

  const listElements = document.createElement('ul');
  listElements.classList.add('list-group', 'border-0', 'rounded-0');

  if (elementCreated === 'feeds') {
    elements.forEach((feed) => {
      const feedItem = createFeedItem(feed);
      listElements.appendChild(feedItem);
    });
  } else if (elementCreated === 'posts') {
    elements.forEach((post) => {
      const postItem = createPostItem(post, viewedPosts);
      if (postItem !== null) {
        listElements.appendChild(postItem);
      }
    });
  }
  cardBody.appendChild(listElements);
  card.appendChild(cardBody);
  elementContainer.appendChild(card);
};
