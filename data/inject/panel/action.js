/* globals youtube, build, items, info */
'use strict';

const args = new URLSearchParams(location.search);

youtube.perform(
  args.get('id'),
  args.get('author'),
  args.get('title')
).then(
  info => build(info),
  e => {
    document.body.dataset.loading = false;
    items.setAttribute('pack', 'center');
    items.setAttribute('align', 'center');
    items.textContent = e.message;
    console.error(e);
  }
);

document.addEventListener('click', e => {
  const cmd = e.target.dataset.cmd;
  if (cmd === 'toggle-toolbar') {
    const item = e.target.parentNode;
    [...items.querySelectorAll('a')]
      .filter(a => a !== item)
      .forEach(a => a.dataset.toolbar = 'false');
    item.dataset.toolbar =
    document.body.dataset.integration =
      item.dataset.toolbar === 'false';
    return;
  }
  else if (cmd === 'close-me') {
    chrome.runtime.sendMessage({
      method: 'close-panel'
    });
  }
  else if (cmd === 'mp3-converter') {
    chrome.runtime.sendMessage({
      method: 'open',
      cmd
    });
  }
  // do not load audio or video files inside the iframe
  const a = e.target.closest('a');
  if (a) {
    if (a.dataset.itag) {
      chrome.runtime.sendMessage({
        method: 'download',
        info,
        itag: a.dataset.itag
      });
    }
    e.stopPropagation();
    e.preventDefault();
  }
});
