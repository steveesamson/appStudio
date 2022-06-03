import Quill from 'quill';
import { attachCloseButton } from './closeButton';
import { getVideoURL } from 'utils/media';
let BlockEmbed = Quill.import('blots/block/embed');
let Link = Quill.import('formats/link');

const ATTRIBUTES = ['data-vid', 'data-type', 'id', 'data-caption'];

/*
 <figure class="video">
    <iframe title="vimeo-player" src="https://player.vimeo.com/video/76979871"
        frameborder="0" allowfullscreen></iframe>
</figure>
<figure class="video">
    <iframe src="https://www.youtube.com/embed/WB3qTVg3hhs?rel=0&showinfo=0" frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
</figure>
*/

class Video extends BlockEmbed {
  static create(value) {
    let node = super.create(value);

    const youTubeAllows = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    const vimeoAllows = 'fullscreen; picture-in-picture';
    const { vid, type, caption, id } = value;
    node.setAttribute('id', id);
    node.setAttribute('data-vid', vid);
    node.setAttribute('data-type', type);
    if(type === 'tt'){
      node.classList.add('tt');
    }
    caption && node.setAttribute('data-caption', caption);

    attachCloseButton(node);

    let iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', true);
    if (type === 'yt') {
      iframe.setAttribute('allow', youTubeAllows);
    } else {
      iframe.setAttribute('allow', vimeoAllows);
    }
    iframe.setAttribute('src', getVideoURL({ vid, type }));
    node.appendChild(iframe);
    if (caption) {
      let figcap = document.createElement('figcaption'),
        figcapText = document.createTextNode(caption);
      figcap.appendChild(figcapText);
      node.appendChild(figcap);
    }
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.firstChild.hasAttribute(attribute)) {
        formats[attribute] = domNode.firstChild.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return {
      vid: domNode.getAttribute('data-vid'),
      type: domNode.getAttribute('data-type'),
      caption: domNode.getAttribute('data-caption'),
      id: domNode.getAttribute('id'),
    };
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
  deleteAt() {
    return false;
  }
}
Video.blotName = 'video';
Video.className = 'video';
Video.tagName = 'FIGURE';

// export default Video;
Quill.register(Video);
