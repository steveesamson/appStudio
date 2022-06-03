import Quill from 'quill';
import { attachCloseButton } from './closeButton';

let BlockEmbed = Quill.import('blots/block/embed');
let Link = Quill.import('formats/link');

const ATTRIBUTES = ['data-source', 'data-caption', 'id'];
/*
<figure>
    <img src="./test.png" alt="Warrior at sunset">
    <figcaption>Warrior at sunset we were very location-based. Probably to the extreme. Like
        most consulting firms</figcaption>
</figure>
*/
class Image extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    const { id, source, caption } = value;
    // let value = JSON.parse(_value);
    node.setAttribute('id', id);
    node.setAttribute('data-source', source);
    caption && node.setAttribute('data-caption', caption);

    attachCloseButton(node, source, 'image');

    let imag = document.createElement('img');
    imag.setAttribute('src', source);
    // imag.setAttribute('data-caption', value.caption);
    node.appendChild(imag);

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
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return {
      source: domNode.getAttribute('data-source'),
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
Image.blotName = 'image';
// Image.className = 'ql-image-wrapper';
Image.tagName = 'FIGURE';

// export default Image;

Quill.register(Image);
