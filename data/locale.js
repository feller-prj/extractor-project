'use strict';

document.addEventListener('DOMContentLoaded', () => {
  [...document.querySelectorAll('[data-i18n]')].forEach(e => {
    e[e.dataset.mtd || 'textContent'] = chrome.i18n.getMessage(e.dataset.i18n);
  });
});

const locale = {
  get(name) {
    return chrome.i18n.getMessage(name.toString()) || name.toString();
  }
};
window.locale = locale;
