import Quill from 'quill';
import { attachCloseButton } from './closeButton';
import { events } from './codeEvents';
const BlockEmbed = Quill.import('blots/block/embed');

const ATTRIBUTES = ['id'];

class CodeBlock extends BlockEmbed {
  static create(value) {
    let node = super.create();
    const { id, language, body } = value;

    node.dataset.language = language;
    node.setAttribute('id', id);
    attachCloseButton(node);

    const code = document.createElement('code');
    code.setAttribute('class', `lang-${language}`);
    code.setAttribute('spellcheck', false);
    code.innerHTML = body.trim();
    node.appendChild(code);
    node.addEventListener('dblclick', () => {
      const { id, language, body } = CodeBlock.value(node);
      events.set({ id, language, body });
    });

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

  static value(domNode) {
    const { language } = domNode.dataset;
    const code = domNode.getElementsByTagName('code')[0];
    let body = '';
    if (code) {
      body = code.textContent;
    }
    // return dset;
    return { language, body, id: domNode.getAttribute('id') };
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
CodeBlock.blotName = 'code-block';
CodeBlock.tagName = 'PRE';
CodeBlock.TAB = '  ';

Quill.register('formats/code-block', CodeBlock);
