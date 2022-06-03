import _events from './common/domEvents';
import { useEvents } from 'utils/events';

export const lazyimage = (node, attrs) => {
  let oldInner = '';
  let im;
  const imageViewer = useEvents('imageViewer');
  const imageFailed = (e) => {
    const { retainOnError = false } = attrs;
    if (retainOnError) {
      node.innerHTML = oldInner;
    } else {
      node.parentNode.removeChild(node);
    }
  };
  const imageClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    imageViewer.setTo({ ...attrs });
  };
  const imageLoaded = (e) => {
    node.innerHTML = ``;
    node.appendChild(im);
    node.dispatchEvent(new CustomEvent('loaded'));
    im.style.pointerEvents = 'auto';
    im.style.cursor = 'pointer';
    _events.addEvent(im, 'click', imageClicked);
    // node.parentNode.replaceChild(im,node);
  };

  const loadSource = () => {
    const { src, alt = '' } = attrs;
    if (!src) return;
    im = new Image();
    oldInner = node.innerHTML;
    node.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height='16' width='16' viewBox="0 0 100 100">
      <circle fill="none" stroke="currentColor" stroke-width="9" cx="50" cy="50" r="40" opacity="0.5" />
      <circle fill="currentColor" stroke="currentColor" stroke-width="7" cx="13" cy="54" r="9">
        <animateTransform
          attributeName="transform"
          dur="2s"
          type="rotate"
          from="0 50 48"
          to="360 50 52"
          repeatCount="indefinite" />
      </circle>
    </svg>`;

    _events.addEvent(im, 'load', imageLoaded);
    _events.addEvent(im, 'error', imageFailed);
    im.src = src.trim();
    im.alt = alt;
  };

  loadSource();

  return {
    update(_attrs) {
      attrs = _attrs;
      loadSource();
    },
    destroy() {
      if (!im) return;
      _events.removeEvent(im, 'load', imageLoaded);
      _events.removeEvent(im, 'error', imageFailed);
    },
  };
};

export const getVideoId = (link) => {
  link = link.replace(/https?:\/\//g, '').replace(/watch\?v=/g, '');
  const [withParams] = link.split(/&/);
  const [url] = withParams.split(/\?/);
  const [domain, ...rest] = url.split(/\//);

  let vid,
    type,
    allow = '';
  switch (domain) {
    case 'www.youtube.com':
    case 'youtu.be':
      type = 'yt';
      allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      vid = rest[0];
      break;
    case 'www.vimeo.com':
    case 'vimeo.com':
      type = 'vm';
      allow = 'fullscreen; picture-in-picture;';
      vid = rest[0];
      break;
    case 'www.tiktok.com':
    case 'tiktok.com':
      type = 'tt';
      vid = rest[2];
  }

  // console.log(type,vid, allow);
  return { vid, type, allow };
};

export const getVideoURL = ({ type, vid }) => {
  //videoData = {type, vid}
  // ? `http://www.youtube.com/embed/${vid}?enablejsapi=1&rel=0&showinfo=0&origin=http://${window.location.hostname}:${window.location.port}`

  switch (type) {
    case 'yt':
      return `https://www.youtube.com/embed/${vid}?enablejsapi=1&rel=0&showinfo=0`;
    case 'vm':
      return `https://player.vimeo.com/video/${vid}?api=1&autoplay=0&loop=1&title=0&byline=0&portrait=0`;
    case 'tt':
      return `https://www.tiktok.com/embed/v2/${vid}?lang=en-GB`;
  }
};

export const gravatar = (avatar) => `https://www.gravatar.com/avatar/${avatar}?d=404`;

export const getPoster = async ({ type, vid }) => {
  switch (type) {
    case 'yt':
      return `https://img.youtube.com/vi/${vid}/mqdefault.jpg`;
    case 'vm':
      try {
        const result = await fetch(`http://vimeo.com/api/v2/video/${vid}.json`);
        const data = await result.json();
        const [only] = data;
        // console.log(only);
        return only.thumbnail_small;
      } catch (e) {
        return 'no_thumbnail';
      }
  }
};
