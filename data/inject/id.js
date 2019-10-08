'use strict';

// Finding id
const script = document.createElement('script');
script.addEventListener('update', () => {
  window.info = {
    id: script.dataset.id,
    title: script.dataset.title,
    author: script.dataset.author
  };
  // console.log(window.info);
});
script.textContent = `
  window.yttools = window.yttools || [];
  function onYouTubePlayerReady(e) {
    window.yttools.forEach(c => c(e));
  }

  {
    const script = document.currentScript;

    // subsequent requests
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (url && url.endsWith('pbj=1') && url.indexOf('watch?v=') !== -1) {
        this.addEventListener('load', () => {
          try {
            const o = JSON.parse(this.responseText);
            if (Array.isArray(o)) {
              for (const i of o) {
                if (i.playerResponse && i.playerResponse.videoDetails) {
                  script.dataset.id = i.playerResponse.videoDetails.videoId;
                  script.dataset.title = i.playerResponse.videoDetails.title;
                  script.dataset.author = i.playerResponse.videoDetails.author;

                  script.dispatchEvent(new Event('update'));
                }
              }
            }
            else {
              console.error('response is not an array');
              script.dataset.id = script.player.getVideoData().video_id;
              script.dispatchEvent(new Event('update'));
            }
          }
          catch(e) {
            console.error('cannot fetch new info');
            script.dataset.id = script.player.getVideoData().video_id;
            script.dispatchEvent(new Event('update'));
          }
        });
      }
      return open.apply(this, arguments);
    };
    // initial page
    window.yttools.push(e => {
      const o = e.getVideoData();
      script.dataset.id = o.video_id;
      script.player = e;
      if (o.title) {
        script.dataset.author = o.author;
        script.dataset.title = o.title;
      }
      else {
        try {
          script.dataset.author = ytplayer.config.args.author;
          script.dataset.title = ytplayer.config.args.title;
        }
        catch (e) {}
      }
      script.dispatchEvent(new Event('update'));
    });

    // https://youtube.github.io/spfjs/documentation/events/
    window.addEventListener('spfready', () => {
      if (typeof window.ytplayer === 'object' && window.ytplayer.config) {
        window.ytplayer.config.args.jsapicallback = 'onYouTubePlayerReady';
      }
    });
  }
`;
document.documentElement.appendChild(script);
script.remove();
