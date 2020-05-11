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
    e.preventDefault();
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
  else if (cmd === 'download-with-tdm') {
    const item = document.querySelector('.item[data-toolbar=true]');
    if (item) {
      let id = 'pabnknalmhfecdheflmcaehlepmhjlaa';
      let link = 'https://chrome.google.com/webstore/detail/pabnknalmhfecdheflmcaehlepmhjlaa';
      if (navigator.userAgent.indexOf('Firefox') !== -1) {
        id = 'jid0-dsq67mf5kjjhiiju2dfb6kk8dfw@jetpack';
        link = 'https://addons.mozilla.org/firefox/addon/turbo-download-manager/';
      }
      else if (navigator.userAgent.indexOf('OPR') !== -1) {
        id = 'lejgoophpfnabjcnfbphcndcjfpinbfk';
        link = 'https://addons.opera.com/extensions/details/turbo-download-manager/';
      }
      else if (navigator.userAgent.indexOf('Edg/') !== -1) {
        id = 'mkgpbehnmcnadhklbcigfbehjfnpdblf';
        link = 'https://microsoftedge.microsoft.com/addons/detail/mkgpbehnmcnadhklbcigfbehjfnpdblf';
      }

      chrome.runtime.sendMessage(id, {
        method: 'add-jobs',
        jobs: [{
          link: item.href,
          threads: 3
        }]
      }, resp => {
        if (!resp) {
          chrome.tabs.create({
            url: link
          });
        }
      });
    }
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
