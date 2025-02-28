import onChange from 'on-change';

const renderErr = (error) => {
  const input = document.querySelector('input[id="url-input"]');
  const errMessage = document.querySelector('.feedback');
  errMessage.textContent = '';
  errMessage.classList.remove('text-success');
  errMessage.classList.remove('text-danger');
  if (error !== 'RSS успешно загружен' && error !== null) {
    input.classList.add('is-invalid');
    errMessage.classList.add('text-danger');
  } else {
    input.classList.remove('is-invalid');
    errMessage.classList.add('text-success');
  }
  errMessage.textContent = error;
};

export default function initView(state) {
  const watchedState = onChange(state, (path) => {
    if (path === 'error') {
      renderErr(watchedState.error);
    }
  });
  return watchedState;
}
