'use strict';

/* close panel on reload */
{
  const close = () => chrome.runtime.sendMessage({
    method: 'close-panel'
  });
  document.addEventListener('spfrequest', close);
  window.addEventListener('yt-navigate-start', close);
}

/* appeding button */
function prepare(button, ...cnames) {
  button.title = 'Detect all possible download links';
  button.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    chrome.runtime.sendMessage({
      method: 'display-panel'
    });
  });
  button.classList.add(...cnames);
  button.classList.remove('yt-uix-clickcard-target', 'pause-resume-autoplay');
}

// new UI
{
  const observe = () => {
    const top = document.querySelector('ytd-video-primary-info-renderer #top-level-buttons');
    if (top) {
      try {
        const sample = top.querySelector('ytd-button-renderer');
        if (sample) {
          const parent = sample.parentElement;
          const button = sample.cloneNode(false);
          let a = top.querySelector('ytd-button-renderer a');
          if (a) {
            a = a.cloneNode(true);
            button.appendChild(a);
          }
          prepare(button, 'iaextractor-new-button');
          parent.insertBefore(button, parent.lastChild);
        }
      }
      catch (e) {
        console.error('error while inserting the button', e);
      }
      window.removeEventListener('yt-visibility-refresh', observe);
    }
  };
  window.addEventListener('yt-visibility-refresh', observe);
}
// mobile
{
  const observe = () => {
    const top = document.querySelector('.slim-video-metadata-actions');
    if (top) {
      const sample = top.querySelector('c3-material-button');
      if (sample) {
        const parent = sample.parentElement;
        const button = sample.cloneNode(false);
        prepare(button, 'iaextractor-new-button', 'iaextractor-mobile');
        parent.insertBefore(button, parent.lastChild);
      }
    }
  };
  window.addEventListener('state-navigateend', observe);
}
