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

export const createPostItem = (post) => {
  if (!post.url || !post.title) {
    return null;
  }
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
